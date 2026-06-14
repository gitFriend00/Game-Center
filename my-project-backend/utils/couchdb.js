const nano = require('nano')('http://root:admin@192.168.254.110:5984/')

const couchdb = nano.db.use('couchdb_bri_training')


module.exports = { couchdb }