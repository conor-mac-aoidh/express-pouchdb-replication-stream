/**
 * Express Pouchdb Replication Stream
 *
 * An express endpoint for streaming changes from a
 * couch database to the client in bulk.
 *
 * @author Conor Mac Aoidh <conormacaoidh@gmail.com>
 */
'use strict';
/*jshint camelcase: false */

var pouch = require('pouchdb');
var pouchRepStream = require('pouchdb-replication-stream');

// register pouch-replication-stream as a plugin
pouch.plugin(pouchRepStream.plugin);
pouch.adapter('writeableStream', pouchRepStream.adapters.writeableStream);

/**
 * ExpressPouchReplicationStream
 *
 * An express endpoint for streaming changes from a
 * couch database to the client in bulk.
 *
 * @param opts
 *          - url: full url of couch db location
 *          - replication: options to be passed to couchdb
 *              - filter
 *              - query_params
 *          see:
 *
 * http://wiki.apache.org/couchdb/Replication#Filtered_Replication
 */
var ExpressPouchReplicationStream = function(opts){
  this.url = opts.url;
  this.dbReq = !!opts.dbReq;
  this.replicationOpts = opts.replication;
  return this.run.bind(this);
};

/**
 * run
 *
 * Runs the actuall replication, streaming the output to
 * the response.
 *
 * @param req
 * @param res
 * @param next
 */
ExpressPouchReplicationStream.prototype.run = function(req, res, next){
  var url = this.url;
  // db is passed in the request
  if(this.dbReq){
    url += '/' + req.params.db;
  }
  var db = new pouch(url);
  db.dump(res, this.replicationOpts)
    .catch(function(err){
      res.send(err);
    });
};

module.exports = ExpressPouchReplicationStream;
