from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime
import orm

db_engine = create_engine("mysql://root:password@localhost/mars?charset=utf8")
db_session = sessionmaker(bind=db_engine)

def list_person():
    session = db_session()
    orm_obj = session.query(orm.Person).order_by(orm.Person.id.desc()).all()
    session.close()
    return orm_obj

def create_person(data):
    session = db_session()
    orm_obj = orm.Person(no=data["no"], region=data["region"], sex=data["sex"], age=data["age"], phone=data["phone"], create_at=datetime.datetime.now())
    session.add(orm_obj)
    session.commit()
    session.close()
