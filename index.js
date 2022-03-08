#!/usr/bin/env node

const {program} = require('commander');
program.version(require('./package.json').version, '-v, --version');
const inquirer = require('inquirer');

const path = require('path');
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
    // install tigergraph
    if (ret.installTigergraph === 'y') {
      installTigergraph().then(() => {
        // install template
        const projectPath = path.join('./', ret.name);
        pullTemplate(projectPath, 'tigergraph-fe-template', ret).then(() => {
          pullTemplate(projectPath, 'tigergraph-be-template', ret);
        });
      });
    } else {
      // install template
      const projectPath = path.join('./', ret.name);
      pullTemplate(projectPath, 'tigergraph-fe-template', ret).then(() => {
        pullTemplate(projectPath, 'tigergraph-be-template', ret);
      });
    }
  });
})

program.parse(process.argv);