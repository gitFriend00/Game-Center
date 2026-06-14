const express = require('express')
const router = express.Router()


const { insertGame, getAllGames, updateGame, deleteGame } = require('../controllers/GameController')

router.post('/insertGame', insertGame)
router.get('/getAllGames', getAllGames)
router.put('/updateGame/:id', updateGame)
router.delete('/deleteGame/:id', deleteGame)







module.exports = router