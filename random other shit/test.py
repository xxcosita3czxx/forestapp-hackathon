import requests
data = {"msg":"Kys"}
contentcheck = requests.post("192.168.0.10", data)
print(contentcheck)
if contentcheck["safe"] == "True":
    print("Huewhg")