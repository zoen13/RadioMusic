const express = require("express")
const router = express()
const { createRequest } = require("../util/util")

router.get("/", (req, res) => {
  const keywords = req.query.keywords
  const type = req.query.type || 1
  const limit = req.query.limit || 50
  const offset = req.query.offset || 0

  const data = 's=' + keywords + '&limit=' + limit + '&type=' + type + '&offset=' + offset
  createRequest('/api/search/pc/', 'POST', data)
    .then(result => {
      res.setHeader("Content-Type", "application/json")
      res.send(result)
    })
    .catch(err => {
      res.status(502).send('fetch error')
    })
})

module.exports = router