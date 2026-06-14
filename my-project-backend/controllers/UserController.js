const { couchdb } = require('../utils/couchdb')

//get Specific 
exports.getSpecificUser = async (req, res) => {
  let UserName = req.params.UserName
  let Password = req.params.Password
  const body = await couchdb.view('User', 'getSpecificUser', {
    include_docs: true,
    key:[UserName,Password]
  })
  
  const couchdata = body.rows.map(row => row.doc)

  if(couchdata.length > 0){
    res.send(couchdata)
  }else{
    res.send([])
  }
}




