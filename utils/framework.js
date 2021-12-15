"use strict";
exports.__esModule = true;
exports.create = exports.getAllFrameworList = void 0;
var chalk = require("chalk");
var fs = require("fs-extra");
var path = require("path");
var handlebars = require("handlebars");
var inquirer = require("inquirer");
var ora = require("ora");
var shell = require("shelljs");
var download_git_repo_1 = require("download-git-repo");
var index_1 = require("../config/index");
/**
 * 框架数组
 */
function getAllFrameworList() {
    var frameworkList = new Array();
    for (var c in index_1.config) {
        for (var _i = 0, _a = index_1.config[c]; _i < _a.length; _i++) {
            var item = _a[_i];
            frameworkList.push(item);
        }
    }
    for (var _b = 0, frameworkList_1 = frameworkList; _b < frameworkList_1.length; _b++) {
        var frameItem = frameworkList_1[_b];
        console.info(chalk.blue("".concat(frameItem.type, "\uFF08").concat(frameItem.name, "\uFF09")));
    }
}
exports.getAllFrameworList = getAllFrameworList;
var spinner = ora(chalk.green("下载中..."));
var cwd = process.cwd();
// 版本号正则
var versionReg = /^([0-9]\d|[0-9])(\.([0-9]\d|\d)){2}$/;
// 验证输入的合法性
var validateInput = function (answers) {
    if (!answers.projectName) {
        console.log(chalk.bgRed("项目名称不能为空！"));
        return false;
    }
    if (!versionReg.test(answers.version)) {
        console.log(chalk.red("请填写正确的版本号：格式(x.x.x) 其中 x 必须为数字，最多两位数：如 0.0.1 或 0.0.11"));
        return false;
    }
    return true;
};
function create() {
    inquirer
        .prompt([
        {
            type: "list",
            name: "projectTemplate",
            message: "请选择项目模板?",
            choices: index_1.config.registrydownload
        },
        {
            type: "input",
            name: "projectName",
            message: "请填写项目名称"
        },
        {
            type: "input",
            name: "version",
            message: "请填写项目版本"
        },
    ])
        .then(function (answers) {
        // 验证输入的合法性
        if (validateInput(answers)) {
            // 获取当前路径
            var targetDir = path.resolve(cwd, answers.projectName || ".");
            // 判断当前路径下是否有这个文件夹
            if (!fs.existsSync(targetDir)) {
                var projectTemplate = answers.projectTemplate;
                if (projectTemplate === "oms_b2b_framework" ||
                    projectTemplate === "oms_b2c_framework") {
                    copyTemplate(answers);
                }
                else {
                    downloadGitRepo(answers);
                }
            }
            else {
                console.log(chalk.bgRed("当前路径已存在同名目录，请确定后再试"));
            }
        }
    });
}
exports.create = create;
/**
 * 下载 git 仓库
 * @param {项目名} projectName
 */
function downloadGitRepo(answers) {
    var projectTemplate = answers.projectTemplate, projectName = answers.projectName, version = answers.version;
    console.log(chalk.blue("正在拉取" + projectTemplate + "项目模板"));
    spinner.start();
    var index = index_1.config.registrydownload.findIndex(function (cb) { return cb.name == projectName; });
    (0, download_git_repo_1["default"])(index_1.config.registrydownload[index].download, projectName, { clone: true }, function (err) {
        if (err) {
            // 下载失败
            spinner.fail(chalk.bgRed("下载失败"));
        }
        else {
            // 下载成功
            // 获取当前路径
            var targetDir = path.resolve(cwd, answers.projectName || ".");
            var packagePath = "".concat(targetDir, "/package.json");
            var packageContent = fs.readFileSync(packagePath, "utf8");
            var packageResult = handlebars.compile(packageContent)({
                version: version,
                name: projectName
            });
            fs.writeFileSync(packagePath, packageResult);
            spinner.succeed(chalk.bgGreen("下载成功"));
        }
    });
}
function copyTemplate(answers) {
    spinner.start("初始化中...");
    var projectTemplate = answers.projectTemplate, projectName = answers.projectName, version = answers.version;
    // 获取当前路径
    var templatePath = path.resolve(cwd, "./template/".concat(projectTemplate));
    var newTemplateJsonPath = path.resolve(cwd, "./".concat(projectName, "/package.json"));
    var newTemplatePath = path.resolve(cwd, "./".concat(projectName));
    shell.cp("-R", templatePath, newTemplatePath);
    var packageContent = fs.readFileSync(newTemplateJsonPath, "utf8");
    var packageResult = handlebars.compile(packageContent)({
        version: version,
        name: projectName
    });
    fs.writeFileSync(newTemplateJsonPath, packageResult);
    spinner.succeed(chalk.bgGreen("初始化成功"));
}
