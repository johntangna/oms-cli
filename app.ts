#!/usr/bin/env node
import { program } from "commander";
import { version } from "./package.json";
import { getAllFrameworList, create } from "./utils/framework";
program.version(version);
program
  .command("ls")
  .description("all framework can use")
  .action(getAllFrameworList);
// 初始化模板
program.command("init").description("初始化项目模板").action(create);

program.parse(process.argv);
