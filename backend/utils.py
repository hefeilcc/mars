# -*- coding: UTF-8 -*-
import logging

logging.basicConfig(level=logging.DEBUG,
                    filename="/var/log/mars.log",
                    datefmt="%Y-%m-%d %H:%M:%S",
                    format="[%(asctime)s|%(levelname)s|%(process)d|%(filename)s|%(lineno)d] %(message)s")

logger = logging.getLogger(__name__)
