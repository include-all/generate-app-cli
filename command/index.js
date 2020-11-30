#!/usr/bin/env node

const program = require('commander');
const init = require('./action/init.js')

program
  .version('0.1.0')
  .usage('<command> [options]')
  .option('-i, --init [name]', 'init a react project')

program.command('init <name>').description("init a react project").action(init)


// 写这里help才有commands,要写在command后面
program.parse(process.argv)
