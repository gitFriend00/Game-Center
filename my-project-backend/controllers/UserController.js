const { couchdb } = require('../utils/couchdb')

// get specific user by username/password
exports.getSpecificUser = async (req, res) => {
  try {
    const UserName = req.params.UserName
    const Password = req.params.Password
    const body = await couchdb.view('User', 'getSpecificUser', {
      include_docs: true,
      key: [UserName, Password]
    })

    const couchdata = body.rows.map(row => row.doc)
    res.send(couchdata)
  } catch (error) {
    console.error('Error fetching specific user:', error)
    res.status(500).send({ error: 'Failed to fetch user' })
  }
}

// create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = req.body
    if (!newUser || !newUser.UserName || !newUser.Password) {
      return res.status(400).send({ error: 'UserName and Password are required' })
    }

    const result = await couchdb.insert(newUser)
    res.status(201).send({ ok: true, id: result.id, rev: result.rev })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).send({ error: 'Failed to create user' })
  }
}




