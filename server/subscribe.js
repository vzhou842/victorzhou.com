// The Subscribe API.
const express = require('express');
const path = require('path');
const request = require('request-promise');
const { PUBLIC_PATH } = require('./constants');

const { SENDY_HOST, ML_LIST_ID, WEB_LIST_ID, MISC_LIST_ID } = process.env;

// Check for env vars
if (!SENDY_HOST || !ML_LIST_ID || !WEB_LIST_ID || !MISC_LIST_ID) {
  console.error('Not all env vars were provided!');
  process.exit(1);
}

const listIDs = {
  ml: ML_LIST_ID,
  web: WEB_LIST_ID,
  misc: MISC_LIST_ID,
};

function initSubscribeAPI(app) {
  app.use(express.urlencoded({ extended: false }));
  app.post('/subscribe', (req, res) => {
    const { lists, ...params } = req.body;
    const listArr = lists.split(',');

    const promises = [];
    listArr.forEach(list => {
      if (listIDs[list]) {
        promises.push(
          request.post(`http://${SENDY_HOST}/subscribe`).form({ ...params, list: listIDs[list] }),
        );
      }
    });

    Promise.all(promises).then(() => {
      // TODO: send subscription settings file.
      res.status(200).sendFile(path.join(PUBLIC_PATH, '/index.html'));
    }).catch(err => {
      console.error(err);
      res.status(500).end();
    });
  });
}

module.exports = initSubscribeAPI;
