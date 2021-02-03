// chalk 输出文字颜色
const chalk = require('chalk')
// 进度条
const ora = require('ora')
// 模板下载
const download = require('download-git-repo')

const path = require('path')
const fse = require('fs-extra')

const inquirerPrompt = require('../utils/inquirer-prompt')
const fillTemplate = require('../utils/fill-template')
const output = require('../utils/output')

module.exports = async () => {

  const answer = await inquirerPrompt({})

  const downloadPath = `https://github.com/include-all/${answer.template}.git#main`
  const spinner = ora(`正在从github下载template, 路径为：${downloadPath}`)
  spinner.start()

  // 下载
  const pwd = process.cwd()
  const tempDir = 'temp'
  download(`direct:${downloadPath}`, tempDir, { clone: true }, async err => {
    if (err) {
      spinner.fail()
      console.error(chalk.red(err))
      return
    }
    //复制和删除临时文件夹
    fse.copySync(path.resolve(pwd, `./${tempDir}`), pwd)
    fse.removeSync(path.resolve(pwd, `./${tempDir}`))
    // 修改模板和输出
    const projectName = pwd.split('/').pop()
    await fillTemplate({ ...answer, packageJsonFilePath: 'package.json', projectName })
    await output({ dirPath: pwd })
    spinner.succeed(chalk.greenBright('create project success'));
    console.log(
      `
        ${chalk.blueBright('npm install')}
        ${chalk.blueBright('npm run start')}
      `
    )
  })
}