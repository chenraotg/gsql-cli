const ora = require('ora');
const chalk = require('chalk');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

const githubAccount = 'tianqingfish';

function pullTemplate(projectPath, templateName, params) {
  const spinner = ora(chalk.cyan(`downloading ${templateName}, please wait...`));
  spinner.start();
  return new Promise((resolve, reject) => {
    download(`${githubAccount}/${templateName}`, projectPath, {clone: false}, (err) => {
      if (!err) {
        spinner.succeed();
        
        // replace projectName, author, desc of package.json
        const readmePath = path.join(projectPath, 'README.md');
        writePackageJson(readmePath, params);

        console.log(chalk.green(`${templateName} init success`));
        resolve();
      } else {
        reject(err);
      }
    })
  });
}

function writePackageJson(readmePath, params) {
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath).toString();
    const template = handlebars.compile(content);
    const result = template(params);
    fs.writeFileSync(readmePath, result);
  } else {
    console.log(chalk.yellow('warning: no readme.md found'));
  }
}

exports.pullTemplate = pullTemplate;