const ora = require('ora');
const chalk = require('chalk');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

const githubAccount = 'tianqingfish';

const template2Path = {
  'tigergraph-be-template': 'web-server',
  'tigergraph-fe-template': 'web-ui'
}

function pullTemplate(projectPath, templateName, params) {
  const spinner = ora(chalk.cyan(`downloading ${templateName}, please wait...`));
  spinner.start();
  const downloadPath = path.join(projectPath, template2Path[templateName]);
  return new Promise((resolve, reject) => {
    download(`${githubAccount}/${templateName}`, downloadPath, {clone: true}, (err) => {
      if (!err) {
        spinner.succeed();
        
        // replace projectName, author, desc of package.json
        const packagePath = path.join(downloadPath, 'package.json');
        writePackageJson(packagePath, params);

        console.log(chalk.green(`${templateName} init success`));
        resolve();
      } else {
        reject(err);
      }
    })
  });
}

function writePackageJson(packagePath, params) {
  if (fs.existsSync(packagePath)) {
    const content = fs.readFileSync(packagePath).toString();
    const template = handlebars.compile(content);
    const result = template(params);
    fs.writeFileSync(packagePath, result);
  } else {
    console.log(chalk.yellow('warning: no package.json found'));
  }
}

exports.pullTemplate = pullTemplate;