import express from 'express'
import User from '../models/user'

let router = express.Router()

// Méthode 1 :
router.get('/usersTuto', (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
    console.log(docs)
    res.json(docs)

    console.error(err)
  })
})

// Méthode 2 :
router.get('/usersMilolib', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'Here is the list of users!',
        content: users
      })
    }
  })
})

// Méthode 3 :
router.get('/usersVue', (req, res) => {
  User.find({}, {
    password: 0
  }, (err, usersList) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'Here is the list of users!',
        content: usersList
      })
    }
  })
})

export default router
