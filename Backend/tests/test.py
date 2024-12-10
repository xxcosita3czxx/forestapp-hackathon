import datetime
from datetime import timedelta

import utils.configmanager as cm  # noqa: F401

#print(add.check_aes_code("mrnobody3.",cm.users.get("dc14774f-f8e2-4246-8cbe-7c71533d8384","general","pass"),"success-dc14774f-f8e2-4246-8cbe-7c71533d8384"))

current_timestamp = datetime.datetime.now()
current_timestamp_ = datetime.datetime.timestamp(current_timestamp)
new_timestamp = current_timestamp + timedelta(minutes=30)
new_timestamp = datetime.datetime.timestamp(new_timestamp)
print(current_timestamp_)  # noqa: T201
print(new_timestamp)  # noqa: T201
print(int(new_timestamp))  # noqa: T201
