/** Worker Service
* v 0.0.1 runs when the /test endpoint is hit. 
* will eventually run on a schedule
*/

var rp = require('request-promise');
var pb = require('./parseBot.js');
var e = require('./errors.js');


/** Accepts and HTTP request and response
* reads the channels database
* gets the last updated date
* checks the publishers URL to see if they have fresh conent
* if there is new conent it updates the last_updated date in the channel table
* and calls the parseBot service passing in the appropriate params 
*/
module.exports = (/*req,  res*/) => {
  'use strict'

/**Logs errors to a flat file
*@params [filename]
*@params [location] - This is the location where the error was called.  The function name or description
*@params [error] - This is the error as returned as an argument to each catch block
 */


  //output to show the master bot is runnin
  // console.log('<=====================>Master Bot Running<=======================>');
  rp('http://127.0.0.1:3000/v1/channels')
  .then( data => {
    data = JSON.parse(data);
    return data.data;
  })
  .then(dataArray => {
    dataArray.forEach(data => {
      let lastUpdate = data.last_updated || 'Thu, 26 May 2016 23:30:18 GMT';
      lastUpdate = Date.parse(lastUpdate);
      
      let options = {
        resolveWithFullResponse: true,
        headers:{
          'If-Modified-Since': lastUpdate
        }
      }
      
      rp(data.url, options)
      .then(response => {  
        let modDate = Date.parse(response.headers['last-modified']);

        if(modDate > lastUpdate && response.body !== undefined) {
         let options = {
            method: 'PUT',
            uri: 'http://127.0.0.1:3000/v1/channels/' + data.id,
            body: {
              'last_updated': modDate
            }, 
            json: true
          }

          rp(options)
          .catch(err =>  {
            e('dbErrorLog', 'last modified update', err);
          });
          pb(data.url, data.publisher_id);
        }      
      }
      ).catch (err => {
        e('dbErrorLog', 'channel update', err);
      });
    })
  })
  .catch( err => 
   e('dbErrorLog', 'channel table update', err)  
  );
}