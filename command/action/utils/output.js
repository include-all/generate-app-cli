const chalk = require('chalk')
const fs = require('fs')
module.exports = async ({ dirPath }) => {
  const files = fs.readdirSync(dirPath)
  // 换行
  console.log()
  for (file of files) {
    console.log(`${chalk.green('created success')}: ${file}`)
  }
}