import os
import sys
import traceback
import tornado
from tornado import web
from tornado import gen

class RootHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def get(self):
        yield self.init()

    @gen.coroutine
    def init(self):
        if os.path.exists("/tmp/login.tmp"):
            print("index page")
            self.render("index.html")
        else:
            print("login page")
            self.render("login.html")
