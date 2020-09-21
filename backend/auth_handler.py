# -*- coding: UTF-8 -*-
import os
import sys
import traceback
import uuid
import json
import random
import time
import tornado
from tornado import web
from tornado import gen
from db.mysql import api as mysql_api
from db.redis import api as redis_api

class AuthHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        method = getattr(self, handler)
        yield method()

    @gen.coroutine
    def login(self):
        account = self.get_argument("account")
        password = self.get_argument("password")

        print("request url: %s, account: %s, password: %s" % (self.request.uri, account, password))

        session_id = str(uuid.uuid4())
        redis_api.save_session(session_id, account)

        self.set_secure_cookie("session_id", session_id)

        self.redirect("/")
