#!/usr/bin/env node

const {program} = require('commander');
program.version(require('./package.json').version, '-v, --version');
const inquirer = require('inquirer');
const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const { installTigergraph } = require('./install-tigergraph');
const { pullTemplate } = require('./templates');

const Inquirer = [
  {
    name: 'name',
    message: 'what\'s the name of new solution?'
  },
  {
    name: 'description',
    message: 'what\'s the description of the solution?'
  },
  {
    name: 'author',
    message: 'who is the author?',
    default: 'tigergraph'
  }
];

program.command('init solution').description('init a solution').action((name, opts) => {
  inquirer.prompt(Inquirer)
  .then((ret) => {
    const projectPath = path.join('./', ret.name);
    fs.mkdirSync(ret.name);

    // install template
    pullTemplate(projectPath, 'tigergraph-solution-template', ret).then(() => {
      // init git for solution, .git will be generated on root path
      exec(`cd ${ret.name} && git init`, (err, stdout, stderr) => {
        if (err) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      })
    });
  });
})

program.parse(process.argv);