"use strict";
exports.__esModule = true;
exports.config = void 0;
exports.config = {
    localdownload: [
    // {
    //   type: "b2b",
    //   name: "oms_b2b_framework",
    //   download: "",
    // },
    // {
    //   type: "b2c",
    //   name: "oms_b2c_framework",
    //   download: "",
    // },
    ],
    registrydownload: [
        {
            type: "b2b",
            name: "oms_b2b_framework_gitea",
            download: "direct:https://github.com/qq449245884/github-antd-vue-template.git#main"
        },
        {
            type: "b2c",
            name: "oms_b2c_framework_gitea",
            download: "direct:https://github.com/qq449245884/github-antd-vue-admin-template.git#main"
        },
    ]
};
