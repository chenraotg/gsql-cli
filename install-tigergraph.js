const chalk = require('chalk');
const Path = require('path');
const Axios = require('axios');
const ProgressBar = require('progress');
const fs = require('fs');

const url = 'http://tigergraph-release-download.s3.amazonaws.com/enterprise-edition/tigergraph-3.5.0-offline.tar.gz';

async function installTigergraph() {
  console.log(chalk.green('Connecting remote...'));
  const {data, headers} = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  const totalLength = headers['content-length'];

  console.log(chalk.green('Starting download...'));
  const progressBar = new ProgressBar('-> downloading [:bar] :percent', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength)
  })

  const writer = fs.createWriteStream(
    Path.resolve(__dirname, '', 'tigergraph-3.5.0-offline.tar.gz')
  )

  data.on('data', (chunk) => {
    progressBar.tick(chunk.length);
  });
  data.pipe(writer);
}

exports.installTigergraph = installTigergraph;