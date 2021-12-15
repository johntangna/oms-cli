#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var package_json_1 = require("./package.json");
var framework_1 = require("./utils/framework");
commander_1.program.version(package_json_1.version);
commander_1.program
    .command("ls")
    .description("all framework can use")
    .action(framework_1.getAllFrameworList);
// 初始化模板
commander_1.program.command("init").description("初始化项目模板").action(framework_1.create);
commander_1.program.parse(process.argv);
