import os
import sys
import traceback
import tornado
import tornado.process
import tornado.httpserver

from backend import index_handler
from backend import person_handler

def make_app():
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "frontend/template"),
        "static_path": os.path.join(os.path.dirname(__file__), "frontend/static"),
    }

    app = tornado.web.Application([
        (r"/", index_handler.IndexHandler),
        (r"/person/(.*)", person_handler.PersonHandler),
    ], **settings)

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
