import express from 'express'

let router = express.Router()

router.get('/tuto', function (req, res) {
  res.send('Hello! The API is at http://localhost:2702 ?')
})

export default router
