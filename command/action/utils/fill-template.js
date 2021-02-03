const handlebars = require('handlebars')
const fs = require('fs')

module.exports = async ({ packageJsonFilePath, projectName, description, author }) => {
  // 下载成功
  const fileContent = fs.readFileSync(packageJsonFilePath).toString()
  const meta = {
    name: projectName,
    description: description,
    author: author
  }
  const result = handlebars.compile(fileContent)(meta)
  fs.writeFileSync(packageJsonFilePath, result)
}