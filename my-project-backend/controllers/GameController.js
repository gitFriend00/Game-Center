const {couchdb} = require('../utils/couchdb')

exports.insertGame = async (req, res) => {
  console.log(req.body)
  let result = await couchdb.insert(req.body)
  res.send(result)
}


exports.getAllGames = async (req, res) => {

  const body = await couchdb.view('Game', 'getAllGames', {
    include_docs: true
  })
  
  const couchdata = body.rows.map(row => row.doc)
  res.send(couchdata)
}

exports.updateGame = async (req, res) => {
  try {
    const gameId = req.params.id
    const gameData = req.body
    
    // Ensure the _id and _rev are set for CouchDB update
    gameData._id = gameId
    
    // Get the current document to retrieve its _rev
    const currentDoc = await couchdb.get(gameId)
    gameData._rev = currentDoc._rev
    
    const result = await couchdb.insert(gameData)
    res.send(result)
  } catch (error) {
    console.error('Error updating game:', error)
    res.status(500).send({ error: 'Failed to update game' })
  }
}

exports.deleteGame = async (req, res) => {
  try {
    const gameId = req.params.id
    
    // Get the current document to retrieve its _rev
    const currentDoc = await couchdb.get(gameId)
    
    // Delete the document by passing _deleted: true
    const result = await couchdb.destroy(currentDoc._id, currentDoc._rev)
    res.send(result)
  } catch (error) {
    console.error('Error deleting game:', error)
    res.status(500).send({ error: 'Failed to delete game' })
  }
}