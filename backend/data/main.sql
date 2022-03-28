/*
 Navicat Premium Data Transfer

 Source Server         : database
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 20/03/2022 21:10:54
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for Books
-- ----------------------------
DROP TABLE IF EXISTS "Books";
CREATE TABLE "Books" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT(30),
  "date" TEXT(30),
  "nric" TEXT(30),
  "center" TEXT(30),
  "slot_number" INTEGER(10)
);

-- ----------------------------
-- Records of Books
-- ----------------------------

-- ----------------------------
-- Table structure for Centers
-- ----------------------------
DROP TABLE IF EXISTS "Centers";
CREATE TABLE "Centers" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT(200)
);

-- ----------------------------
-- Records of Centers
-- ----------------------------
INSERT INTO "Centers" VALUES (0, 'None');
INSERT INTO "Centers" VALUES (1, 'Bukit Batok CC');
INSERT INTO "Centers" VALUES (2, 'Bukit Panjang CC');
INSERT INTO "Centers" VALUES (3, 'Bukit Timah CC');
INSERT INTO "Centers" VALUES (4, 'Outram Park Polyclinic');

-- ----------------------------
-- Table structure for Nurse_Workdays
-- ----------------------------
DROP TABLE IF EXISTS "Nurse_Workdays";
CREATE TABLE "Nurse_Workdays" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "nurse" integer(11),
  "work_date" text(30) DEFAULT '',
  "center" integer(30)
);

-- ----------------------------
-- Records of Nurse_Workdays
-- ----------------------------

-- ----------------------------
-- Table structure for Nurses
-- ----------------------------
DROP TABLE IF EXISTS "Nurses";
CREATE TABLE "Nurses" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" text(30) DEFAULT '',
  "center" INTEGER(11)
);

