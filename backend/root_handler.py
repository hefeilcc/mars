# -*- coding: UTF-8 -*-
import tornado
from tornado import web
from tornado import gen

from session_handler import SessionHandler
from utils import logger

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
