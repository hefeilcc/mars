import os
import sys
import traceback
import tornado
from tornado import web
from tornado import gen
from db.redis import api as redis_api

class RootHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def get(self):
        yield self.init()

    @gen.coroutine
    def init(self):
        session_id = self.get_secure_cookie("session_id")
        if session_id:
            session_content = redis_api.get_session(session_id)
            if session_content:
                self.render("index.html")
                return

        self.render("login.html")
