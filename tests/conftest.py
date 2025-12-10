"""
Configuração do pytest e setup de imports
"""
import sys
import os
from pathlib import Path
import warnings
import socket
import subprocess
import time
import pytest

# Definir ambiente de teste
os.environ["ENVIRONMENT"] = "test"

# Suprimir DeprecationWarning gerado pelo passlib/crypt em alguns ambientes
warnings.filterwarnings(
	"ignore",
	message=r".*crypt is deprecated and slated for removal.*",
	category=DeprecationWarning,
)
warnings.filterwarnings(
	"ignore",
	category=DeprecationWarning,
	module=r".*passlib.*",
)

# Adiciona o diretório raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "src"))


def _wait_for_port(host: str, port: int, timeout: float = 5.0) -> bool:
	"""Wait until a TCP port is open or timeout."""
	deadline = time.time() + timeout
	while time.time() < deadline:
		try:
			with socket.create_connection((host, port), timeout=0.5):
				return True
		except OSError:
			time.sleep(0.1)
	return False


@pytest.fixture(scope="session", autouse=True)
def start_uvicorn_server():
	"""Start the FastAPI app with uvicorn in a background process for tests.

	This fixture runs once per test session and makes the API available on
	localhost:8000 so tests that call requests.get/post succeed.
	"""
	# Only start server when running tests (ENVIRONMENT already set to 'test')
	host = os.environ.get("TEST_HOST", "127.0.0.1")
	port = int(os.environ.get("TEST_PORT", "8000"))

	# Start uvicorn using the project's main app
	# We call `python -m uvicorn main:app --host ... --port ...` to ensure it
	# runs with the same interpreter/venv used by pytest.
	cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", host, "--port", str(port)]

	# Start process
	proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

	try:
		started = _wait_for_port(host, port, timeout=5.0)
		if not started:
			proc.kill()
			raise RuntimeError(f"Uvicorn server did not start on {host}:{port}")
		yield
	finally:
		try:
			proc.terminate()
		except Exception:
			pass
		proc.wait(timeout=2)