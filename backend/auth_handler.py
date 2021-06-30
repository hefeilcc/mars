# -*- coding: UTF-8 -*-
import json
import hashlib
import tornado
from tornado import web
from tornado import gen

from session_handler import SessionHandler
from db.mysql import api as mysql_api
from utils import logger

class AuthHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        method = getattr(self, handler)
        para = json.loads(self.request.body)
        response = yield method(para)
        self.finish(json.dumps(response))

    @gen.coroutine
    def login(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        account = para["account"]
        password = para["password"]

        md5sum = hashlib.md5()
        md5sum.update(password)

        result = mysql_api.get_account(account)
        if not result:
            response["errcode"] = 1
            response["message"] = "account not exist: %s" % account
            logger.debug(response)
            return response

        if result.password != md5sum.hexdigest():
            response["errcode"] = 2
            response["message"] = "password check fail"
            logger.debug(response)
            return response

        session = SessionHandler(self)
        session.save_session({"account": account})
        
        return response
