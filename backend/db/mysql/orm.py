from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import String

Base = declarative_base()

class Person(Base):
    __tablename__ = "tb_person"
    id = Column(String(64), primary_key=True)
    name = Column(String(64))
