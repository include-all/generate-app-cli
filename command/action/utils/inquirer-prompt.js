// inquirer 命令行交互
const inquirer = require('inquirer')
// chalk 输出文字颜色
const chalk = require('chalk')
// 文件操作
const fs = require('fs')

module.exports = async ({ needProjectName = false, projectName }) => {
  let prompts = []
  // 项目名
  if (needProjectName && fs.existsSync(projectName)) {
    console.error(chalk.red('there is same name project'))
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'please input the project name:',
      validate(input) {
        if (!input) {
          return 'project name can not be empty!'
        }
        if (fs.existsSync(input)) {
          return 'there is same name project'
        }
        return true
      }
    })
  }
  //选择模板
  prompts.push(
    {
      name: 'template',
      message: 'select template:',
      type: 'list',
      choices: [
        {
          name: 'react-app,base on create-react-app',
          value: 'react-app-template'
        },
        {
          name: 'react-ts-app, base on https://juejin.cn/post/6860129883398668296',
          value: 'react-ts-app-template'
        },
        {
          name: 'koa-app,base on koa,typescript',
          value: 'koa-app-template'
        },
      ],
    }
  )
  // 项目描述
  prompts.push({
    type: 'input',
    name: 'description',
    message: 'description：'
  })

  // 项目作者
  prompts.push({
    type: 'input',
    name: 'author',
    message: 'author: '
  })

  const answer = await inquirer.prompt(prompts)
  return answer
}