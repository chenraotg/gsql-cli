const chalk = require('chalk');
const Path = require('path');
const Axios = require('axios');
const ProgressBar = require('progress');
const fs = require('fs');
const { exec } = require('child_process');

const tigergraphSuffix = 'tigergraph-3.5.0-offline.tar.gz';

const url = `http://tigergraph-release-download.s3.amazonaws.com/enterprise-edition/${tigergraphSuffix}`;

async function installTigergraph(projectName) {
  const downloadPath = Path.join(__dirname, projectName);
  const writer = fs.createWriteStream(
    Path.resolve(downloadPath, '', tigergraphSuffix)
  )
  return Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  }).then(res => {
    return new Promise((resolve, reject) => {
      const totalLength = res.headers['content-length'];
      res.data.pipe(writer);
      let error = null;
      const progressBar = new ProgressBar('-> downloading tigergraph [:bar] :percent', {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength)
      })
      res.data.on('data', (chunk) => {
        progressBar.tick(chunk.length);
      });
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      })
      writer.on('close', () => {
        exec(`tar -xf ${tigergraphSuffix}`);
        if (!error) {
          resolve(true);
        }
      })
    })
  })

}

exports.installTigergraph = installTigergraph;