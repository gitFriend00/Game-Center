const { couchdb } = require('../utils/couchdb')

//get Specific 
exports.getSpecificEmployee = async (req, res) => {
  let EmployeeCode = req.params.EmployeeCode
  let Password = req.params.Password
  const body = await couchdb.view('Employees', 'getSpecificEmployee', {
    include_docs: true,
    key:[EmployeeCode,Password]
  })
  
  const couchdata = body.rows.map(row => row.doc)

  if(couchdata.length > 0){
    res.send(couchdata)
  }else{
    res.send([])
  }
}

exports.getAllFruits = async (req, res) => {

  const body = await couchdb.view('Fruits', 'getAllFruits', {
    include_docs: true
  })
  
  const couchdata = body.rows.map(row => row.doc)
  res.send(couchdata)
}


