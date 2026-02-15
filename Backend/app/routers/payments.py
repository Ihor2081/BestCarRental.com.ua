from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def create_payment():
    return {"message": "Payment logic coming soon"}