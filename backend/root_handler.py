import os
import sys
import traceback
import tornado
from tornado import web
from tornado import gen
from session_handler import SessionHandler

class RootHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def get(self):
        yield self.init()

    @gen.coroutine
    def init(self):
        session = SessionHandler(self)
        if session.check_session():
            self.render("index.html")
        else:
            self.render("login.html")
