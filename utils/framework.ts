import { config } from "../template/config";
import chalk from "chalk";
/**
 * 框架类型
 */
export type framework = {
  type: string;
  name: string;
  download: string;
};
/**
 * 框架数组
 */
export function getAllFrameworList() {
  let frameworkList: Array<framework> = new Array();
  for (let k in config) {
    frameworkList.push(config[k]);
  }
  for (let [key, frameItem] of frameworkList.entries()) {
    console.info(chalk.blue(`${key}（${frameItem.name}）`));
  }
}
