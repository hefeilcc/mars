# -*- coding: UTF-8 -*-
import uuid

from db.redis import api as redis_api
from utils import logger

class SessionHandler():
    def __init__(self, http_request):
        self.http_request = http_request

    def check_session(self):
        session_id = self.http_request.get_secure_cookie("session_id")
        if not session_id:
            return False

        session_content = redis_api.get_session(session_id)
        if not session_content:
            return False

        redis_api.update_session(session_id)
        return True

    def save_session(self, session_content):
        session_id = str(uuid.uuid4())
        redis_api.save_session(session_id, session_content)
        self.http_request.set_secure_cookie("session_id", session_id)
