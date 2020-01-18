'use strict';

// [START functions_helloworld_http]
const escapeHtml = require('escape-html');
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'ketonemaniac@gmail.com',
  from: 'test@example.com',
  subject: 'Test auto send email',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();


var dt = require('./myModule');

// [END functions_helloworld_http]

// [START functions_helloworld_get]
/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloGET = (req, res) => {
  sgMail.send(msg);
  res.send('Hello World!');
};
// [END functions_helloworld_get]

// [START functions_helloworld_http]
/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')} ${dt.myDateTime()} !`);
};
// [END functions_helloworld_http]

// [START functions_helloworld_background]
/**
 * Background Cloud Function.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.helloBackground = (data, context, callback) => {
  callback(null, `Hello ${data.name || 'World'}!`);
};
// [END functions_helloworld_background]

// [START functions_helloworld_storage]
/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.helloGCS = (data, context) => {
  const file = data;
  if (file.resourceState === 'not_exists') {
    console.log(`File ${file.name} deleted.`);
  } else if (file.metageneration === '1') {
    // metageneration attribute is updated on metadata changes.
    // on create value is 1
    console.log(`File ${file.name} uploaded.`);
  } else {
    console.log(`File ${file.name} metadata updated.`);
  }

  const myFile = storage.bucket("cloud-function-test-storage").file(file.name);

  myFile.download(function(err, contents) {
       console.log("file err: "+err);  
       console.log("file data: "+contents);
       msg.text = contents.toString();
       msg.html = contents.toString();
       console.log(msg);
       sgMail.send(msg);   
       console.log("sending complete");
  }); 

};
// [END functions_helloworld_storage]

// [START functions_helloworld_storage_generic]
/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.helloGCSGeneric = (data, context, callback) => {
  const file = data;

  console.log(`  Event: ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  callback();
};
// [END functions_helloworld_storage_generic]

