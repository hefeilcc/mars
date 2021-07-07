# -*- coding: UTF-8 -*-
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import orm

db_engine = create_engine("mysql://root:password@localhost/mars?charset=utf8")
db_session = sessionmaker(bind=db_engine)

def get_account(account):
    session = db_session()
    result = session.query(orm.Account).filter(orm.Account.account==account).filter(orm.Account.delete==0).first()
    session.close()
    return result

def list_person():
    session = db_session()
    result = session.query(orm.Person).filter(orm.Person.delete==0).order_by(orm.Person.id.desc()).all()
    session.close()
    return result

def create_person(data):
    session = db_session()
    person = orm.Person(id_card=data["id_card"], region=data["region"], sex=data["sex"], age=data["age"], phone=data["phone"], create_at=datetime.datetime.now())
    session.add(person)
    session.commit()
    session.close()

def update_person(id, phone, region):
    session = db_session()
    session.query(orm.Person).filter(orm.Person.id==id).filter(orm.Person.delete==0).update({"phone":phone, "region":region, "update_at":datetime.datetime.now()})
    session.commit()
    session.close()

def update_person_status(id, status):
    session = db_session()
    session.query(orm.Person).filter(orm.Person.id==id).filter(orm.Person.delete==0).update({"status":status, "update_at":datetime.datetime.now()})
    session.commit()
    session.close()

def delete_person(id_list, soft_delete=True):
    if soft_delete:
        session = db_session()
        session.query(orm.Person).filter(orm.Person.id.in_(id_list)).filter(orm.Person.delete==0).update({"delete":1, "delete_at":datetime.datetime.now()}, synchronize_session=False)
        session.commit()
        session.close()
    else:
        session = db_session()
        session.query(orm.Person).filter(orm.Person.id.in_(id_list)).delete(synchronize_session=False)
        session.commit()
        session.close()

def list_sbaidu():
    session = db_session()
    result = session.query(orm.Sbaidu).filter(orm.Sbaidu.delete==0).order_by(orm.Sbaidu.id.desc()).all()
    session.close()
    return result

def create_sbaidu(data):
    session = db_session()
    sbaidu = orm.Sbaidu(category=data["category"], question=data["question"], solution=data["solution"], sharer=data["sharer"], remark=data["remark"], create_at=datetime.datetime.now())
    session.add(sbaidu)
    session.commit()
    session.close()

def update_sbaidu(id, category, question, solution, remark):
    session = db_session()
    session.query(orm.Sbaidu).filter(orm.Sbaidu.id==id).filter(orm.Sbaidu.delete==0).update({"category":category, "question":question, "solution":solution, "remark":remark, "update_at":datetime.datetime.now()})
    session.commit()
    session.close()

def delete_sbaidu(id_list, soft_delete=True):
    if soft_delete:
        session = db_session()
        session.query(orm.Sbaidu).filter(orm.Sbaidu.id.in_(id_list)).filter(orm.Sbaidu.delete==0).update({"delete":1, "delete_at":datetime.datetime.now()}, synchronize_session=False)
        session.commit()
        session.close()
    else:
        session = db_session()
        session.query(orm.Sbaidu).filter(orm.Sbaidu.id.in_(id_list)).delete(synchronize_session=False)
        session.commit()
        session.close()

def get_doc(id):
    session = db_session()
    result = session.query(orm.Doc).filter(orm.Doc.id==id).filter(orm.Doc.delete==0).first()
    session.close()
    return result

def list_doc():
    session = db_session()
    result = session.query(orm.Doc).filter(orm.Doc.delete==0).order_by(orm.Doc.id.desc()).all()
    session.close()
    return result

def create_doc(data):
    session = db_session()
    doc = orm.Doc(category=data["category"], title=data["title"], file_path=data["file_path"], sharer=data["sharer"], create_at=datetime.datetime.now())
    session.add(doc)
    session.commit()
    session.close()

def update_doc(id, category, title, file_path):
    update_dict = {
        "category":category,
        "title":title,
        "update_at":datetime.datetime.now(),
    }

    if file_path:
        update_dict["file_path"] = file_path

    session = db_session()
    session.query(orm.Doc).filter(orm.Doc.id==id).filter(orm.Doc.delete==0).update(update_dict)
    session.commit()
    session.close()

def delete_doc(id_list, soft_delete=True):
    if soft_delete:
        session = db_session()
        session.query(orm.Doc).filter(orm.Doc.id.in_(id_list)).filter(orm.Doc.delete==0).update({"delete":1, "delete_at":datetime.datetime.now()}, synchronize_session=False)
        session.commit()
        session.close()
    else:
        session = db_session()
        session.query(orm.Doc).filter(orm.Doc.id.in_(id_list)).delete(synchronize_session=False)
        session.commit()
        session.close()
