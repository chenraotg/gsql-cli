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
  },
  {
    name: 'installTigergraph',
    message: 'do you want to install tigergraph, it may take long time(y/n)',
    choices: ['y', 'n'],
    default: 'n'
  },
  {
    name: 'graphQL',
    type: '',
    message: 'do you want to use graphQL(urql)(y/n)?',
    choices: ['y', 'n'],
    default: 'n'
  }
];

program.command('init solution').description('init a solution').action((name, opts) => {
  inquirer.prompt(Inquirer)
  .then((ret) => {
    const projectPath = path.join('./', ret.name);
    fs.mkdirSync(ret.name);

    // install template
    pullTemplate(projectPath, 'tigergraph-solution-template', ret).then(() => {
      // install tigergraph
      if (ret.installTigergraph === 'y') {
        installTigergraph(ret.name);
      }
    });
  });
})

program.parse(process.argv);