
from sqlmodel import Field, SQLModel


class test(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    huewhg: str = Field(index=True)
