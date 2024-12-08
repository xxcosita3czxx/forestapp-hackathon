import requests
data = {"msg":"Kys"}
contentcheck = requests.post("http://192.168.0.10:8000", data)

print(contentcheck)
if contentcheck["safe"] == "True":
    print("Huewhg")