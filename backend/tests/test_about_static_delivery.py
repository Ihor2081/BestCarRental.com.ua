import importlib
import re
import shutil
import uuid
from pathlib import Path

import pytest
from fastapi.staticfiles import StaticFiles
from fastapi.testclient import TestClient
from starlette.routing import Mount

import app.main as main_module


def _get_static_mount():
    for route in main_module.app.routes:
        if isinstance(route, Mount) and route.path == "/static":
            return route
    raise AssertionError("The /static mount was not found on the FastAPI app.")


def _point_static_mount_to(tmp_path: Path, monkeypatch):
    static_mount = _get_static_mount()
    monkeypatch.setattr(static_mount.app, "directory", str(tmp_path))
    monkeypatch.setattr(static_mount.app, "all_directories", [str(tmp_path)])
    return static_mount


def _get_about_page_static_assets() -> list[str]:
    repo_root = Path(__file__).resolve().parents[2]
    about_page_path = repo_root / "frontend" / "src" / "app" / "about" / "page.tsx"
    about_page_source = about_page_path.read_text(encoding="utf-8")
    return sorted(set(re.findall(r'["\'](/static/[^"\']+)["\']', about_page_source)))


@pytest.fixture
def static_root():
    repo_root = Path(__file__).resolve().parents[2]
    path = repo_root / "backend" / ".about-static-test" / uuid.uuid4().hex
    path.mkdir(parents=True, exist_ok=True)
    try:
        yield path
    finally:
        shutil.rmtree(path.parent.parent, ignore_errors=True)


def test_static_route_is_mounted_correctly():
    static_mount = _get_static_mount()

    assert static_mount.name == "static"
    assert isinstance(static_mount.app, StaticFiles)
    assert static_mount.path == "/static"


def test_main_creates_static_directory_if_missing(monkeypatch):
    created_dirs = []

    expected_static_dir = str(
        Path(main_module.__file__).resolve().parent.parent / "static"
    )

    def fake_exists(path):
        return path != expected_static_dir

    class DummyStaticFiles:
        def __init__(self, directory, *args, **kwargs):
            self.directory = directory
            self.all_directories = [directory]

    with monkeypatch.context() as patched:
        patched.setattr(main_module.os.path, "exists", fake_exists)
        patched.setattr(
            main_module.os,
            "makedirs",
            lambda path, exist_ok=False: created_dirs.append((path, exist_ok)),
        )
        patched.setattr("fastapi.staticfiles.StaticFiles", DummyStaticFiles)

        reloaded_main = importlib.reload(main_module)

        assert created_dirs == [(expected_static_dir, True)]
        assert reloaded_main.static_dir == expected_static_dir

    importlib.reload(main_module)


def test_static_about_image_is_served_successfully(static_root, monkeypatch):
    asset_path = static_root / "about" / "our-team.jpg"
    asset_path.parent.mkdir(parents=True, exist_ok=True)
    asset_path.write_bytes(b"fake-jpg-bytes")

    _point_static_mount_to(static_root, monkeypatch)
    monkeypatch.setattr(main_module.app.router, "on_startup", [])

    with TestClient(main_module.app) as client:
        response = client.get("/static/about/our-team.jpg")

    assert response.status_code == 200
    assert response.content == b"fake-jpg-bytes"


def test_missing_static_about_image_returns_404(static_root, monkeypatch):
    _point_static_mount_to(static_root, monkeypatch)
    monkeypatch.setattr(main_module.app.router, "on_startup", [])

    with TestClient(main_module.app) as client:
        response = client.get("/static/about/missing-file.jpg")

    assert response.status_code == 404


def test_all_about_page_static_assets_are_accessible(static_root, monkeypatch):
    assets = _get_about_page_static_assets()

    for asset_url in assets:
        relative_asset_path = asset_url.removeprefix("/static/")
        asset_path = static_root / relative_asset_path
        asset_path.parent.mkdir(parents=True, exist_ok=True)
        asset_path.write_bytes(f"asset for {relative_asset_path}".encode("utf-8"))

    _point_static_mount_to(static_root, monkeypatch)
    monkeypatch.setattr(main_module.app.router, "on_startup", [])

    with TestClient(main_module.app) as client:
        responses = {asset_url: client.get(asset_url) for asset_url in assets}

    assert assets == ["/static/about/our-team.jpg"]
    for asset_url, response in responses.items():
        assert response.status_code == 200, asset_url


def test_real_about_image_exists_in_backend_static_directory():
    repo_root = Path(__file__).resolve().parents[2]
    image_path = repo_root / "backend" / "static" / "about" / "our-team.jpg"

    assert image_path.exists()
    assert image_path.stat().st_size > 0
