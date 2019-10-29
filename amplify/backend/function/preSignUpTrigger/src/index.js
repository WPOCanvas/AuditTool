

const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "AuditToolDB";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

exports.handler = (event, _context, callback) => {

  if (event.request.userAttributes.hasOwnProperty('custom:organization')) {
    const req = event.request;
    const email = req.userAttributes.email;
    const username = req.username;
    const organization = req.userAttributes['custom:organization'];

    const org = {
      pk: 'Organization',
      sk: organization,
      username,
      email
    }

    const user = {
      pk: 'User',
      sk: 'Org_'+organization,
      username,
      email
    }

    let putItemParams = {
      TableName: tableName,
      Item: org
    }

    let putItemParamsUser = {
      TableName: tableName,
      Item: user
    }


    dynamodb.put(putItemParams, (err) => {
      if (err) {
        callback(err, event);
      } else {
        dynamodb.put(putItemParamsUser, err => {
          if (err) {
            callback(err, event)
          } else {
            callback(null, event);
          }
        })
      }
    })
  } else {
    callback(null, event)
  }

};
