from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func as sa_func
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import os
import random
from dotenv import load_dotenv

from database import get_db
from models import User, RoleEnum, VerificationCode, VerificationTypeEnum
from email_service import send_reset_email, send_verification_email

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-token-generation")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

router = APIRouter(prefix="/api/auth", tags=["auth"])

# --- Pydantic Schemas ---

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    drivers_license: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

# --- Helper Functions ---

def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-character limit, truncate to avoid errors
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-character limit, truncate to avoid errors
    return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Auth Endpoints ---

@router.post("/register")
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        phone=user_data.phone,
        drivers_license=user_data.drivers_license,
        address=user_data.address,
        role=RoleEnum.client
    )
    
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
        
        # Generate verification code
        code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        code_hash = get_password_hash(code)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        verification_code = VerificationCode(
            email=user_data.email,
            type=VerificationTypeEnum.verify_email,
            code_hash=code_hash,
            expires_at=expires_at
        )
        db.add(verification_code)
        await db.commit()
        
        # Send verification email
        send_verification_email(user_data.email, code)
        
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered or database error"
        )
    
    return {"status": "success", "message": "User registered successfully"}

@router.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email to log in."
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    # Rate limiting: Max 5 requests per hour per email
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    result = await db.execute(
        select(sa_func.count(VerificationCode.id))
        .where(VerificationCode.email == request.email)
        .where(VerificationCode.type == VerificationTypeEnum.reset_password)
        .where(VerificationCode.created_at >= one_hour_ago)
    )
    request_count = result.scalar()
    
    if request_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many reset requests. Please try again later."
        )

    # Find user
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    # Always return 200 to prevent user enumeration
    if user:
        # Generate 6-digit code
        code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        code_hash = get_password_hash(code)
        expires_at = datetime.utcnow() + timedelta(minutes=15)
        
        # Invalidate previous codes for this email
        await db.execute(
            update(VerificationCode)
            .where(VerificationCode.email == request.email)
            .where(VerificationCode.type == VerificationTypeEnum.reset_password)
            .where(VerificationCode.is_used == 0)
            .values(is_used=1)
        )
        
        # Save new code
        reset_code = VerificationCode(
            email=request.email,
            type=VerificationTypeEnum.reset_password,
            code_hash=code_hash,
            expires_at=expires_at
        )
        db.add(reset_code)
        await db.commit()
        
        # Send email
        send_reset_email(request.email, code)
        
    return {"status": "success", "message": "If the account exists, a verification code has been sent."}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    # Find the latest unused code for this email
    result = await db.execute(
        select(VerificationCode)
        .where(VerificationCode.email == request.email)
        .where(VerificationCode.type == VerificationTypeEnum.reset_password)
        .where(VerificationCode.is_used == 0)
        .order_by(VerificationCode.created_at.desc())
    )
    reset_code = result.scalars().first()
    
    if not reset_code:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
    
    # Check expiration
    if datetime.utcnow() > reset_code.expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired")
    
    # Verify code
    if not verify_password(request.code, reset_code.code_hash):
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Update user password
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password_hash = get_password_hash(request.new_password)
    
    # Mark code as used
    reset_code.is_used = 1
    
    await db.commit()
    
    return {"status": "success", "message": "Password updated successfully"}

@router.post("/verify-email")
async def verify_email(request: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    # Find the latest unused code for this email
    result = await db.execute(
        select(VerificationCode)
        .where(VerificationCode.email == request.email)
        .where(VerificationCode.type == VerificationTypeEnum.verify_email)
        .where(VerificationCode.is_used == 0)
        .order_by(VerificationCode.created_at.desc())
    )
    verification_code = result.scalars().first()
    
    if not verification_code:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
    
    # Check expiration
    if datetime.utcnow() > verification_code.expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired")
    
    # Verify code
    if not verify_password(request.code, verification_code.code_hash):
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Update user verification status
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = 1
    
    # Mark code as used
    verification_code.is_used = 1
    
    await db.commit()
    
    return {"status": "success", "message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(request: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        return {"status": "success", "message": "Email already verified"}
    
    # Rate limiting: Max 5 requests per hour per email
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    result = await db.execute(
        select(sa_func.count(VerificationCode.id))
        .where(VerificationCode.email == request.email)
        .where(VerificationCode.type == VerificationTypeEnum.verify_email)
        .where(VerificationCode.created_at >= one_hour_ago)
    )
    request_count = result.scalar()
    
    if request_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many verification requests. Please try again later."
        )

    # Generate 6-digit code
    code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    code_hash = get_password_hash(code)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Invalidate previous codes
    await db.execute(
        update(VerificationCode)
        .where(VerificationCode.email == request.email)
        .where(VerificationCode.type == VerificationTypeEnum.verify_email)
        .where(VerificationCode.is_used == 0)
        .values(is_used=1)
    )
    
    # Save new code
    verification_code = VerificationCode(
        email=request.email,
        type=VerificationTypeEnum.verify_email,
        code_hash=code_hash,
        expires_at=expires_at
    )
    db.add(verification_code)
    await db.commit()
    
    # Send verification email
    send_verification_email(request.email, code)
    
    return {"status": "success", "message": "Verification code resent successfully"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
