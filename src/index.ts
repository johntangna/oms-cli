import { program } from "commander";
import { version } from "../package.json";
import { getAllFrameworList } from "../utils/framework";
program.version(version, "-V, --version", "print out the current version");
program
  .command("-ls")
  .description("all framework can use")
  .action(getAllFrameworList);
