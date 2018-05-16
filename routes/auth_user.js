import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import dotEnv from 'dotenv'
dotEnv.config()

let router = express.Router()

// Méthode 1 :
router.post('/authTuto', (req, res) => {
  if (!req.body.email && !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'Missing email and/or password.'
    })
  }
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    // if (err) throw err
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    } else if (!user) {
      res.status(400).json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else if (user) {
      if (!user.comparePasswords(req.body.password)) {
        res.status(400).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        })
      } else {
        const payload = {
          _id: user._id,
          email: user.email,
          userCollection: 'User' // Obligatoire dans la méthode 2 du verify_token.js
        }
        let token = jwt.sign(payload, process.env.SECRETKEY, {
        })
        res.status(200).json({
          success: true,
          message: 'Enjoy your token!',
          content: {
            token: process.env.AUTHBEARER + ' ' + token
          }
        })
      }
    }
  })
})

// Méthode 2 :
router.post('/authMilolib', (req, res) => {
  if (!req.body.email && !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'Missing email and/or password.'
    })
  }
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    // if (err) throw err
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    } else if (!user) {
      res.status(400).json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else if (user) {
      if (!user.comparePasswords(req.body.password)) {
        res.status(400).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        })
      } else {
        jwt.sign({
          _id: user._id,
          email: user.email,
          userCollection: 'User' // Obligatoire dans la méthode 2 du verify_token.js
        }, process.env.SECRETKEY, (err, result) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: err.message
            })
          } else {
            res.status(200).json({
              success: true,
              message: 'Welcome !',
              content: {
                token: process.env.AUTHBEARER + ' ' + result
              }
            })
          }
        })
      }
    }
  })
})

// Méthode 3 :
router.post('/authVue', (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message
        })
      }
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        })
      } else if (user) {
        if (!user.comparePasswords(req.body.password)) {
          res.status(401).json({
            success: false,
            message: 'Wrong password..'
          })
        } else {
          jwt.sign({
            _id: user._id,
            email: user.email,
            userCollection: 'User' // Obligatoire dans la méthode 2 du verify_token.js
          },
          process.env.SECRETKEY,
          function (err, result) {
            if (err) {
              res.status(500).json({
                success: false,
                message: err.message
              })
            } else {
              res.status(200).json({
                success: true,
                message: 'Here is your AwesomeToken !',
                content: {
                  token: process.env.AUTHBEARER + ' ' + result
                }
              })
            }
          })
        }
      }
    })
  } else {
    res.status(412).json({
      success: false,
      message: 'Username and/or password are missing..'
    })
  }
})

export default router
