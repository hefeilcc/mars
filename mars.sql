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
-- Table structure for tb_account
-- ----------------------------
DROP TABLE IF EXISTS `tb_account`;
CREATE TABLE `tb_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '表id',
  `account` varchar(64) NOT NULL DEFAULT '' COMMENT '账号',
  `password` varchar(64) NOT NULL DEFAULT '' COMMENT '密码',
  `create_at` datetime DEFAULT NULL COMMENT '创建时间',
  `update_at` datetime DEFAULT NULL COMMENT '更新时间',
  `delete_at` datetime DEFAULT NULL COMMENT '删除时间',
  `delete` int(11) DEFAULT '0' COMMENT '删除标记',
  PRIMARY KEY (`id`),
  KEY `key_account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_account
-- ----------------------------
INSERT INTO `tb_account` VALUES ('1', 'admin', '5f4dcc3b5aa765d61d8327deb882cf99', now(), null, null, 0);

-- ----------------------------
-- Table structure for tb_person
-- ----------------------------
DROP TABLE IF EXISTS `tb_person`;
CREATE TABLE `tb_person` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '表id',
  `id_card` varchar(64) NOT NULL DEFAULT '' COMMENT '身份证号码',
  `region` varchar(256) NOT NULL DEFAULT '' COMMENT '地区',
  `sex` varchar(64) NOT NULL DEFAULT '' COMMENT '性别',
  `age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄',
  `phone` varchar(64) NOT NULL DEFAULT '' COMMENT '手机',
  `status` int(11) DEFAULT '0' COMMENT '状态',
  `create_at` datetime DEFAULT NULL COMMENT '创建时间',
  `update_at` datetime DEFAULT NULL COMMENT '更新时间',
  `delete_at` datetime DEFAULT NULL COMMENT '删除时间',
  `delete` int(11) DEFAULT '0' COMMENT '删除标记',
  PRIMARY KEY (`id`),
  KEY `key_id_card` (`id_card`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tb_sbaidu
-- ----------------------------
DROP TABLE IF EXISTS `tb_sbaidu`;
CREATE TABLE `tb_sbaidu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '表id',
  `category` varchar(64) NOT NULL DEFAULT '' COMMENT '分类',
  `question` varchar(256) NOT NULL DEFAULT '' COMMENT '问题描述',
  `solution` varchar(1024) DEFAULT '' COMMENT '解决方法',
  `sharer` varchar(64) DEFAULT '' COMMENT '分享人',
  `remark` varchar(1024) DEFAULT '' COMMENT '备注',
  `create_at` datetime DEFAULT NULL COMMENT '创建时间',
  `update_at` datetime DEFAULT NULL COMMENT '更新时间',
  `delete_at` datetime DEFAULT NULL COMMENT '删除时间',
  `delete` int(11) DEFAULT '0' COMMENT '删除标记',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
