/*
Navicat MySQL Data Transfer

Source Server         : 192.168.0.202
Source Server Version : 50565
Source Host           : 192.168.0.202:3306
Source Database       : mars

Target Server Type    : MYSQL
Target Server Version : 50565
File Encoding         : 65001

Date: 2020-09-10 20:34:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_person
-- ----------------------------
DROP TABLE IF EXISTS `tb_person`;
CREATE TABLE `tb_person` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '表id',
  `no` varchar(64) NOT NULL DEFAULT '' COMMENT '身份证号码',
  `region` varchar(256) NOT NULL DEFAULT '' COMMENT '地区',
  `sex` varchar(64) NOT NULL DEFAULT '' COMMENT '性别',
  `age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄',
  `phone` varchar(64) NOT NULL DEFAULT '' COMMENT '手机',
  `create_at` datetime DEFAULT NULL COMMENT '创建时间',
  `update_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `key_no` (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_person
-- ----------------------------
