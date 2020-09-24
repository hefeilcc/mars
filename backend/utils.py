# -*- coding: UTF-8 -*-
import logging

logging.basicConfig(level=logging.DEBUG,
                    filename="/var/log/mars.log",
                    datefmt="%Y-%m-%d %H:%M:%S",
                    format="[%(asctime)s|%(process)d|%(levelname)s] %(message)s [%(filename)s:%(lineno)d]")

logger = logging.getLogger(__name__)
