// chalk 输出文字颜色
const chalk = require('chalk')
// 进度条
const ora = require('ora')
// 模板下载
const download = require('download-git-repo')

const inquirerPrompt = require('../utils/inquirer-prompt')
const fillTemplate = require('../utils/fill-template')
const output = require('../utils/output')


module.exports = async (projectName) => {
  const answer = await inquirerPrompt({ needProjectName: true, projectName })

  const downloadPath = `https://github.com/include-all/${answer.template}.git#main`
  const spinner = ora(`正在从github下载template, 路径为：${downloadPath}`)
  spinner.start()

  const dirName = answer.projectName || projectName

  download(`direct:${downloadPath}`, dirName, { clone: true }, async err => {
    if (err) {
      spinner.fail()
      console.error(chalk.red(err))
      return
    }
    await fillTemplate({ ...answer, packageJsonFilePath: `${dirName}/package.json`, projectName: dirName })
    await output({ dirPath: dirName })
    spinner.succeed(chalk.greenBright('create project success'));
    console.log(
      `
        ${chalk.blueBright('npm install')}
        ${chalk.blueBright('npm run start')}
      `
    )
  })
}