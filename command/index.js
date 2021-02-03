#!/usr/bin/env node

const program = require('commander');
const create = require('./action/create/index.js')
const init = require("./action/init/index.js")

program
  .version('0.1.0')
  .usage('<command> [options]')
  .option('-i, --create [name]', 'create a new project')
  .option('-i, --init', 'init a project in exist folder')

program.command('create <name>').description("create a new project").action(create)
program.command('init').description("init a project in exist project").action(init)

// 写这里help才有commands,要写在command后面
program.parse(process.argv)
