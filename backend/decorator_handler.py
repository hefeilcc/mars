# -*- coding: UTF-8 -*-
from functools import wraps

from session_handler import SessionHandler
from utils import logger

def login_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        http_request = args[0]
        session = SessionHandler(http_request)
        if session.check_session():
            return func(*args, **kwargs)
        else:
            return {"errcode": 100, "message": "login_required fail"}

    return decorated
