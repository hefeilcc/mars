# -*- coding: UTF-8 -*-
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import DateTime

Base = declarative_base()

class Account(Base):
    __tablename__ = "tb_account"
    id = Column(Integer, primary_key=True)
    account = Column(String(64))
    password = Column(String(64))
    create_at = Column(DateTime)
    update_at = Column(DateTime)
    delete_at = Column(DateTime)
    delete = Column(Integer, default=0)

class Person(Base):
    __tablename__ = "tb_person"
    id = Column(Integer, primary_key=True)
    id_card = Column(String(64))
    region = Column(String(256))
    sex = Column(String(64))
    age = Column(Integer)
    phone = Column(String(64))
    status = Column(Integer, default=0)
    create_at = Column(DateTime)
    update_at = Column(DateTime)
    delete_at = Column(DateTime)
    delete = Column(Integer, default=0)

class Sbaidu(Base):
    __tablename__ = "tb_sbaidu"
    id = Column(Integer, primary_key=True)
    category = Column(String(64))
    question = Column(String(256))
    solution = Column(String(1024))
    sharer = Column(String(64))
    remark = Column(String(1024))
    create_at = Column(DateTime)
    update_at = Column(DateTime)
    delete_at = Column(DateTime)
    delete = Column(Integer, default=0)
