// TUTO : https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

// Import des dépendances :
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotEnv from 'dotenv'

// Import des routes :
import tuto from './routes/tuto'
import createUser from './routes/create_user'
import listUser from './routes/list_user'
import authUser from './routes/auth_user'
import verifyToken from './routes/verify_token'

// Déclaration du .env :
dotEnv.config()

// Initialisation de l'app :
let app = express()

// Use morgan to log requests to the console :
app.use(morgan('dev'))

// CORS
// A partir d'ici, toute les routes utilisent le middleware pour les cross-origin.
// Cela permet d'accepter certaines requetes qui seraient autrement invalides car bloquées par le navigateur ou autre...
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`)
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`)
  res.header(`Access-Control-Allow-Headers`, `Authorization, Content-Type`)
  next()
})

// Use body parser so we can get info from POST and/or URL parameters :
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// ROUTER PREFIX API DEFINING :
let router = express.Router()

// UNPROTECTED ROUTES :
// Si dans un sous dosier : router.use('/dossier', fichier).
router.use(tuto)
router.use(createUser)
router.use(authUser)

// AUTH PROTECTION STARTS HERE :
// Il verifiera à chaque fois si le token est valide avant d'authoriser l'acces à la suite.
router.use(verifyToken)

// PROTECTED ROUTES :
// Si dans un sous dosier : router.use('/dossier', fichier).
router.use(listUser)

app.use(router)

// Fin des routes, on renvoi un 404 not found pour tout le reste.
app.use('/*', (req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: 'This route does not exists.'
    })
})

// app.listen(port)
// console.log('Magic happens at ' + port)

// OU :

// MONGOOSE MONGODB CONNECT
mongoose.Promise = global.Promise // Me demandez pas je sais pas pourquoi mais du moment que ça marche ...
mongoose.connect(process.env.DB, {}, err => {
  if (err) {
    throw err
  } else {
    console.log('Connection to the Database established...')
    // On défini un port depuis le fichier de config .env, si la variable n'existe pas on utilise le port 2702
    let port = process.env.PORT || 2702
    app.listen(port, () => console.log('App listens on port: ' + port))
  }
})
