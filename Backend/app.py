import os

from database import test
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()

def load_routes_from_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.py') and filename != '__init__.py':
            module_name = filename[:-3]
            module_path = os.path.join(directory, filename)
            spec = importlib.util.spec_from_file_location(module_name, module_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            # Assuming each module has a FastAPI app object to include
            if hasattr(module, 'app'):
                app.include_router(module.app)

load_routes_from_directory("./api/")

@app.get("/")
def read_root():
    return {"message": "Custom environment works!"}

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    import uvicorn
    uvicorn.run("app:app", host=host, port=port, reload=debug)
