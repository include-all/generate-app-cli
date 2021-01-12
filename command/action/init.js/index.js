// chalk 输出文字颜色
const chalk = require('chalk')
// 进度条
const ora = require('ora')
// inquirer 命令行交互
const inquirer = require('inquirer')
// 模板下载
const download = require('download-git-repo')
// 文件操作
const fs = require('fs')
// 操作模板
const handlebars = require('handlebars')

module.exports = async (projectName) => {
  let prompts = []
  // 项目名
  if (fs.existsSync(projectName)) {
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
          return ''
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

  const downloadPath = `https://github.com/include-all/${answer.template}.git#main`
  const spinner = ora(`正在从github下载template, 路径为：${downloadPath}`)
  spinner.start()

  const dirName = answer.projectName || projectName

  download(`direct:${downloadPath}`, dirName, { clone: true }, err => {
    if (err) {
      spinner.fail()
      console.error(chalk.red(err))
      return
    }
    // 下载成功
    const packageJsonFilePath = `${dirName}/package.json`
    const fileContent = fs.readFileSync(packageJsonFilePath).toString()
    const meta = {
      name: dirName,
      description: answer.description,
      author: answer.author
    }
    const result = handlebars.compile(fileContent)(meta)
    fs.writeFileSync(packageJsonFilePath, result)

    const files = fs.readdirSync(dirName)
    // 换行
    console.log()
    for (file of files) {
      console.log(`${chalk.green('created success')}: ${file}`)
    }
    spinner.succeed(chalk.greenBright('create project success'));
    console.log(
      `
        ${chalk.blueBright('npm install')}
        ${chalk.blueBright('npm run start')}
      `
    )
  })
}