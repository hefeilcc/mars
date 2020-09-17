# -*- coding: UTF-8 -*-
import os
import sys
import traceback
import json
import random
import time
import tornado
from tornado import web
from tornado import gen
from db.mysql import api as db_api

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
        print("%s - %s" % (account, password))

        os.popen("touch /tmp/login.tmp")

        self.redirect("/")
