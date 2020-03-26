var express = require('express');
const fs = require('fs')
var router = express.Router();

router.get('/', (__, res, ___) => {
  const data = fs.readFileSync(__dirname + '/../../aux/word_list.yaml', 'utf8');
  res.send(`
1:  # easy
  - hello
  - school
2:  # medium
  - nuclear
  - meteor
3:  # hard
  - subcutaneous
  - retrograde
`);
});

module.exports = router;
