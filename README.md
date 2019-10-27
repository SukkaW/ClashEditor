<a href="https://clash.skk.moe"><img src="https://cdn.jsdelivr.net/gh/Dreamacro/clash-dashboard/src/assets/LOGO-fixing.svg" alt="Hexo logo" width="100" height="100" align="right" /></a>


# ClashEditor

> :triangular_ruler: An editor for writing Clash config

一个 [Clash](https://github.com/Dreamacro/clash) 配置文件的编辑向导。

[![Build Status](https://travis-ci.com/SukkaW/ClashEditor.svg?branch=master)](https://travis-ci.com/SukkaW/ClashEditor)
![GitHub License](https://img.shields.io/github/license/sukkaw/clasheditor)

## 使用

https://clash.skk.moe

## 特性

- 所有操作均在浏览器中完成、不依赖服务器
- 与示范配置文件对照编写
- 提供 YAML 语法检查
- 支持多种节点导入方式（仍在不断增加中）
  - 手动填写节点信息
  - 从 Clash 在线托管订阅导入
  - 从 Surge 配置文件导入
- 策略组支持节点拖动排序

## 构建

```bash
$ yarn global add gulp-cli
$ git clone https://github.com/SukkaW/ClashEditor.git
$ cd ClashEditor
$ yarn install
$ gulp dev # Build dev version
$ gulp build # Build production version
$ gulp watch # Build dev version when files changed
```

## 开源许可证

ClashEditor 使用 GPL-3.0 协议开源 - 阅读项目的 [LICENSE](./LICENSE) 文件

## 维护者

**KoolClash** © [Sukka](https://github.com/SukkaW), Released under the [GPL-3.0](./LICENSE) License.<br>
Authored and maintained by [Sukka](https://github.com/SukkaW) with help from contributors ([list](https://github.com/SukkaW/Koolshare-Clash/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)
