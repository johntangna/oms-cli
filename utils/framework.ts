import * as chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";
import * as handlebars from "handlebars";
import * as inquirer from "inquirer";
import * as ora from "ora";
import * as shell from "shelljs";
import * as download from "download-git-repo";
import { config } from "../config/index";
/**
 * 框架类型
 */
interface framework {
  type: string;
  name: string;
  download: string;
}
/**
 * 框架数组
 */
export function getAllFrameworList(): void {
  let frameworkList: Array<framework> = new Array();
  for (let c in config) {
    for (let item of config[c]) {
      frameworkList.push(item);
    }
  }
  for (let frameItem of frameworkList) {
    console.info(chalk.blue(`${frameItem.type}（${frameItem.name}）`));
  }
}
const spinner = ora(chalk.green("下载中..."));

const cwd = process.cwd();
// 版本号正则
const versionReg = /^([0-9]\d|[0-9])(\.([0-9]\d|\d)){2}$/;

// 验证输入的合法性
const validateInput = (answers: any) => {
  if (!answers.projectName) {
    console.log(chalk.bgRed("项目名称不能为空！"));
    return false;
  }
  if (!versionReg.test(answers.version)) {
    console.log(
      chalk.red(
        "请填写正确的版本号：格式(x.x.x) 其中 x 必须为数字，最多两位数：如 0.0.1 或 0.0.11"
      )
    );
    return false;
  }
  return true;
};

export function create() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "projectTemplate",
        message: "请选择项目模板?",
        choices: config.registrydownload,
      },
      {
        type: "input",
        name: "projectName",
        message: "请填写项目名称",
      },
      {
        type: "input",
        name: "version",
        message: "请填写项目版本",
      },
    ])
    .then((answers: any) => {
      // 验证输入的合法性
      if (validateInput(answers)) {
        // 获取当前路径
        const targetDir = path.resolve(cwd, answers.projectName || ".");
        // 判断当前路径下是否有这个文件夹
        if (!fs.existsSync(targetDir)) {
          const { projectTemplate } = answers;
          if (
            projectTemplate === "oms_b2b_framework" ||
            projectTemplate === "oms_b2c_framework"
          ) {
            copyTemplate(answers);
          } else {
            downloadGitRepo(answers);
          }
        } else {
          console.log(chalk.bgRed("当前路径已存在同名目录，请确定后再试"));
        }
      }
    });
}
/**
 * 下载 git 仓库
 * @param {项目名} projectName
 */
function downloadGitRepo(answers: any) {
  const { projectTemplate, projectName, version } = answers;
  console.log(chalk.blue("正在拉取" + projectTemplate + "项目模板"));
  spinner.start();
  download(
    config.registrydownload[projectTemplate].download,
    projectName,
    { clone: true },
    function (err: any) {
      if (err) {
        // 下载失败
        spinner.fail(chalk.bgRed("下载失败"));
      } else {
        // 下载成功
        // 获取当前路径
        const targetDir = path.resolve(cwd, answers.projectName || ".");
        const packagePath = `${targetDir}/package.json`;
        const packageContent = fs.readFileSync(packagePath, "utf8");
        const packageResult = handlebars.compile(packageContent)({
          version,
          name: projectName,
        });
        fs.writeFileSync(packagePath, packageResult);
        spinner.succeed(chalk.bgGreen("下载成功"));
      }
    }
  );
}

function copyTemplate(answers: any) {
  spinner.start("初始化中...");
  const { projectTemplate, projectName, version } = answers;
  // 获取当前路径
  const templatePath = path.resolve(cwd, `./template/${projectTemplate}`);
  const newTemplateJsonPath = path.resolve(
    cwd,
    `./${projectName}/package.json`
  );
  const newTemplatePath = path.resolve(cwd, `./${projectName}`);
  shell.cp("-R", templatePath, newTemplatePath);
  const packageContent = fs.readFileSync(newTemplateJsonPath, "utf8");
  const packageResult = handlebars.compile(packageContent)({
    version,
    name: projectName,
  });
  fs.writeFileSync(newTemplateJsonPath, packageResult);
  spinner.succeed(chalk.bgGreen("初始化成功"));
}
