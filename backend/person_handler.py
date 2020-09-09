import os
import sys
import traceback
import json
import tornado
from tornado import web
from tornado import gen
from db.mysql import api as db_api

class PersonHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        method = getattr(self, handler)
        para = json.loads(self.request.body)
        response = yield method(para)
        self.finish(json.dumps(response))

    @gen.coroutine
    def list(self, para):
        print("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        person_list = [
            {"id": 1, "no": "000000000000000001", "region": "hefei", "sex": "male", "age": 18, "phone": "13800000000", "create": "2020-09-08 20:00:00"},
            {"id": 2, "no": "000000000000000002", "region": "hefei", "sex": "male", "age": 18, "phone": "13800000000", "create": "2020-09-08 20:00:00"},
            {"id": 3, "no": "000000000000000003", "region": "hefei", "sex": "male", "age": 18, "phone": "13800000000", "create": "2020-09-08 20:00:00"},
            {"id": 4, "no": "000000000000000004", "region": "hefei", "sex": "male", "age": 18, "phone": "13800000000", "create": "2020-09-08 20:00:00"},
            {"id": 5, "no": "000000000000000005", "region": "hefei", "sex": "male", "age": 18, "phone": "13800000000", "create": "2020-09-08 20:00:00"},
        ]
        response["person_list"] = person_list

        #print("response: %s" % response)
        return response

    @gen.coroutine
    def create(self, para):
        print("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        db_api.create_person()

        print("response: %s" % response)
        return response
