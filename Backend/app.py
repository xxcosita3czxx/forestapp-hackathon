import importlib
import importlib.util
import logging
import os
import sys

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

#TODO Forum
#TODO Accounts
#TODO Stastuses
#TODO Random message
#TODO Message controll

class ServerHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['server'] = 'FosterAppBackend/1.0'
        return response

app = FastAPI()  # noqa: E501
app.add_middleware(ServerHeaderMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify allowed domains here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, WS, etc.)
    allow_headers=["*"],  # Allow all headers
)
logging.basicConfig(level=logging.WARNING)

# Get the directory of the currently running script (main script)
current_script_directory = os.path.dirname(os.path.abspath(sys.argv[0]))

# Path to the 'scripts' directory (relative to the main script)
scripts_directory = os.path.join(current_script_directory)
os.chdir(scripts_directory)

# Function to dynamically load routes from a directory
def load_routes_from_directory(directory, parent_router=None):
    for filename in os.listdir(directory):
        full_path = os.path.join(directory, filename)

        if os.path.isdir(full_path):
            # If it's a directory, recursively process its contents
            sub_router = APIRouter()
            load_routes_from_directory(full_path, sub_router)
            # Include the sub-router in the parent router or directly in the app
            if parent_router is not None:
                parent_router.include_router(sub_router, prefix=f"/{filename}")
            else:
                app.include_router(sub_router, prefix=f"/{filename}")

        elif filename.endswith('.py') and filename != '__init__.py':
            # Import the Python module dynamically
            module_name = filename[:-3]  # Strip '.py' from filename
            module_path = full_path
            try:
                spec = importlib.util.spec_from_file_location(module_name, module_path)  # noqa: E501
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)

                # Check if the module has a router (WebSocket or API routes) and include it  # noqa: E501
                if hasattr(module, 'router'):
                    if parent_router is not None:
                        parent_router.include_router(module.router)
                        print(f"Loaded {module_name}")
                    else:
                        app.include_router(module.router)
                        print(f"Loaded {module_name}")
            except Exception as e:
                print(f"Failed to load {str(module_name)}, \n{e}")

load_routes_from_directory("api")

@app.get("/")
def read_root():
    return {"message": "Welcome to foster app API!"}

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    import uvicorn
    uvicorn.run("app:app", host=host, port=port, reload=debug)
