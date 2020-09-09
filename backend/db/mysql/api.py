from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import orm

db_engine = create_engine("mysql://root:password@localhost/mars?charset=utf8")
db_session = sessionmaker(bind=db_engine)

def create_person(data):
    session = db_session()
    orm_obj = orm.Person(id="5", name="Lance")
    session.add(orm_obj)
    session.commit()
    session.close()

def list_person():
    session = db_session()
    orm_obj = session.query(orm.Person).filter(orm.Person.id=="5").one()
    session.close()
    return orm_obj
