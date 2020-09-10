from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import DateTime

Base = declarative_base()

class Person(Base):
    __tablename__ = "tb_person"
    id = Column(Integer, primary_key=True)
    no = Column(String(64))
    region = Column(String(256))
    sex = Column(String(64))
    age = Column(Integer)
    phone = Column(String(64))
    create_at = Column(DateTime)
    update_at = Column(DateTime)