import ollama
import fastapi
from fastapi import FastAPI
import os
import requests 
app = FastAPI()
import requests

url = "http://localhost:11434/api/generate"
data = {
    "model": "llama3.2",
    "keep_alive": -1
}

response = requests.post(url, json=data)

print(response.status_code)
print(response.json())  # Assuming the response is JSON

def check(msg):
    messages = [
        {
            'role': 'user',
            'content': "/set system harm,social_bias,violence,profanity,sexual_content,unethical_behavior",
        },
        {
            'role': 'user',
            'content': msg,
        },
    ]
    
    granitecheck = ollama.chat(model="granite3-guardian:8b", messages=messages)['message']['content']
    print(f"granitecheck: {granitecheck}")
    if "No" not in granitecheck:
        granitecheck = True
        
    else:
        granitecheck = False
        return "True"
    if granitecheck:
        finalcheck = ollama.generate(model="stric-llama3.2-guardian", prompt=msg)["response"]
        print(finalcheck)
        if "Unsafe" in finalcheck:
            return "False"
        else:
            return "True"



@app.post("/")
def checkrequest(msg:str):
    return {"safe":str(check(msg))}
if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    import uvicorn
    uvicorn.run("app:app", host=host, port=port, reload=debug)
