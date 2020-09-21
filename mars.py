import os
import sys
import traceback
import tornado
import tornado.process
import tornado.httpserver

from backend import root_handler
from backend import auth_handler
from backend import person_handler

def make_app():
    current_path = os.path.dirname(__file__)
    
    settings = {
        "template_path": os.path.join(current_path, "frontend/template"),
        "static_path": os.path.join(current_path, "frontend/static"),
        "cookie_secret": "d13b9a02-36a7-4951-b9bd-153f5fc93e4e",
    }

    app = tornado.web.Application([
        (r"/", root_handler.RootHandler),
        (r"/auth/(.*)", auth_handler.AuthHandler),
        (r"/person/(.*)", person_handler.PersonHandler),
    ], **settings)

    app.current_path = current_path

    return app

def start():
    try:
        sockets = tornado.netutil.bind_sockets(80)
        tornado.process.fork_processes(1)
        server = tornado.httpserver.HTTPServer(make_app())
        server.add_sockets(sockets)

        print("mars process start...")
        tornado.ioloop.IOLoop.instance().start()

    except:
        print("mars start failed: %s" % traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    start()
