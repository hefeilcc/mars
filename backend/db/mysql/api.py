# -*- coding: UTF-8 -*-
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import orm

db_engine = create_engine("mysql://root:password@localhost/mars?charset=utf8")
db_session = sessionmaker(bind=db_engine)

def get_account(account):
    session = db_session()
    result = session.query(orm.Account).filter(orm.Account.account==account).first()
    session.close()
    return result

def list_person():
    session = db_session()
    result = session.query(orm.Person).order_by(orm.Person.id.desc()).all()
    session.close()
    return result

def create_person(data):
    session = db_session()
    person = orm.Person(id_card=data["id_card"], region=data["region"], sex=data["sex"], age=data["age"], phone=data["phone"], create_at=datetime.datetime.now())
    session.add(person)
    session.commit()
    session.close()

def update_person(id, phone):
    session = db_session()
    session.query(orm.Person).filter(orm.Person.id==id).update({"phone":phone})
    session.commit()
    session.close()

def delete_person(id_list):
    session = db_session()
    session.query(orm.Person).filter(orm.Person.id.in_(id_list)).delete(synchronize_session=False)
    session.commit()
    session.close()
