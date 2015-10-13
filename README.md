### Express Pouchdb Replication Stream

This module provides an express endpoint for streaming bulk couchdb changes to pouchdb. It makes use of the great [PouchDB Replication Stream](https://github.com/nolanlawson/pouchdb-replication-stream) module.

- [Install](#install)
- [Usage](#usage)
- [Database Name in Request](#db-name-in-request)
- [Filtered Replication](#filtered-replication)
- [Replication Options](#replication-options)
- [Error Handling](#error-handling)

### Install

Install with npm:

```bash
npm i express-pouchdb-replication-stream
```

### Usage

Basic usage enables streaming of one db to the client:

```javascript
var express = require('express');
var repStream = require('express-pouchdb-replication-stream');
var app = express();

app.use('/api/couchdb', repStream('http://user:pass@localhost:5984/db'));
```

### Database Name in Request

If you have per-user databases, or you want to get changes from different databases based on the request, this will work:

```javascript
app.use('/api/couchdb/:db', repStream({
  url     : 'http://user:pass@localhost:5984/',
  dbReq   : true
}));
```

### Filtered Replication

In order to do filtered replication, there are two options. If the parameters are known beforehand, then this method can be used:

```javascript
app.use('/api/couchdb', repStream({
  url           : 'http://user:pass@localhost:5984/',
  replication   : {
    filter        : 'myFilterName',
    query_params  : {
      prop1       : 'myFilterParameter1'
    }
  }
});
```

However, if the filter options are also dynamic/based on the request, then the request data must be parsed first:

```javascript
app.use('/api/couchdb/:filterFunc/:filterBy', function(req, res, next){
  var filterFunc = req.params.filterFunc;
  var filterBy = req.params.filterBy;
  repStream({
    url           : 'http://user:pass@localhost:5984/',
    replication   : {
      filter        : filterFunc,
      query_params  : {
        docName     : filterBy
      }
    }
  })(req, res, next);
});
```

### Replication Options

Allowed replication options:

```
batch_size
batches_limit
filter
doc_ids
query_params
since
view
```

[PouchDB Replication Options](http://pouchdb.com/api.html#replication)
[CouchDB Replication Options](http://wiki.apache.org/couchdb/Replication)

### Error Handling

The default behavior is to send an error response with a `500` error code and
the error message. To overwrite this, pass a method to the `error` option:

```javascript
repStream({
  url     : 'http://user:pass@localhost:5984/',
  error   : function(err){
    // do what you will with `err` here
    console.log(err);
    res.send(err);
  }
});

```

