import express from 'express'
import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'

import mongoose from 'mongoose' // Pour Méthode 2
import User from '../models/user' // Pour Méthode 2
const ObjectId = mongoose.Types.ObjectId // Pour Méthode 2
// ATENTION : il faut également dans le auth_user : "userCollection: 'User'" dans le payload du token si la méthode 1 est utilisée !

dotEnv.config()

let router = express.Router()

// Méthode 1 :
router.use(function (req, res, next) {
  // On vérifie la présence d'un header puis si on a dans le headers un "champ" nommé "authorization" puis on le split et on vérifie si c'est égale au AUTHBEARER
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === process.env.AUTHBEARER) {
  // check header or url parameters or post parameters for token
  // let token = req.body.token || req.query.token || req.headers['x-access-token'].split(' ')[1]
    let token = req.body.token || req.query.token || req.headers.authorization.split(' ')[1]
    if (token) {
      jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          })
        } else {
          req.decoded = decoded
          next()
        }
      })
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthozired'
    })
  }
})

// Méthode 2 :
// router.use(function (req, res, next) {
//   // On vérifie la présence d'un header puis si on a dans le headers un "champ" nommé "authorization" puis on le split et on vérifie si c'est égale au AUTHBEARER
//   if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === process.env.AUTHBEARER) {
//     jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRETKEY, (err, decode) => {
//       if (err) {
//         res.status(500).json({
//           success: false,
//           message: err.message
//         })
//       } else {
//         // res.locals permet de stocker des datas utilisable dans la requête en cours
//         res.locals.decode = decode
//         if (ObjectId.isValid(decode._id)) {
//           if (decode.userCollection === 'User') {
//             let Collection = User
//             Collection.findById(decode._id, (err, user) => {
//               if (err) {
//                 res.status(500).json({
//                   success: false,
//                   message: err.message
//                 })
//               } else if (!user) {
//                 res.status(401).json({
//                   success: false,
//                   message: 'Unauthozired'
//                 })
//               } else {
//                 next()
//               }
//             })
//           } else {
//             return res.status(400).json({
//               success: false,
//               message: 'Bad request'
//             })
//           }
//         } else {
//           res.status(400).json({
//             success: false,
//             message: 'Invalid ID'
//           })
//         }
//       }
//     })
//   } else {
//     res.status(401).json({
//       success: false,
//       message: 'Unauthozired'
//     })
//   }
// })

export default router
