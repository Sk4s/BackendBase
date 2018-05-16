import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user'

let router = express.Router()

// Méthode 1 : Créer un utilisateur à partir de la requête
router.get('/signupTuto', function (req, res) {
  let user = new User({
    username: 'Test',
    email: 'test@test.com',
    password: 'test'
    // admin: true
  })
  user.password = bcrypt.hashSync('test', 11)
  user.save(function (err) {
    if (err) throw err
    console.log('User saved !', User)
    res.json({ success: true })
  })
})

// Méthode 2 : Créer un utilisateur à partir d'un formulaire
router.post('/signupMilolib', (req, res) => {
  let user = new User(req.body)
  user.password = bcrypt.hashSync(req.body.password, 10)
  // ATTENTION le code suivant permet bien de créer un utilisateur mais la requête ne va pas au bout et fait péter le backend !
  // user.save((err, user) => {
  //   if (err) {
  //     if (err.message.match(/^E11000 duplicate key error.+/)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Email already used'
  //       })
  //     } else {
  //       return res.status(500).json({
  //         success: false,
  //         message: err.message
  //       })
  //     }
  //   }
  // })
  // ATTENTION le code suivant ne vérifie pas si l'utilisateur exsite déjà et donc fait péter le backend si il existe déjà !
  user.save(function (err) {
    if (err) throw err
    console.log('User saved !', User)
    res.json({
      success: true
    })
  })
})

// Méthode 3 : Créer un utilisateur à partir d'un formulaire
router.post('/signupVue', (req, res) => {
  if (req.body.email && req.body.password && req.body.username) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err.message
        })
      }
      if (user === null) {
        const newUser = new User(req.body)
        newUser.password = bcrypt.hashSync(req.body.password, 11)
        newUser.save((err, nUser) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: err.message
            })
          } else {
            nUser.password = undefined // Permet de renvoyer les données saisies sans le mot de passe
            res.status(200).json({
              success: true,
              message: 'Tadaaa ! New user registed',
              content: nUser
            })
          }
        })
      } else {
        res.status(412).json({
          success: false,
          message: 'This email adress is already taken'
        })
      }
    })
  } else {
    res.status(412).json({
      success: false,
      message: 'You need to enter an email, username and a password !',
    })
  }
})

export default router
