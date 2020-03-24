var express = require('express');
const fs = require('fs')
var router = express.Router();

router.get('/', (req, res, next) => {
  const data = fs.readFileSync(__dirname + '/../../aux/word_list.yaml');
  res.send(data);
});

module.exports = router;
