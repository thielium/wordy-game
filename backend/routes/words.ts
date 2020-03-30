import express from 'express';
import fs from 'fs';
var router = express.Router();

router.get('/', (__: express.Request, res: express.Response) => {
  const data = fs.readFileSync(__dirname + '/../../aux/word_list.yaml', 'utf8');
  res.send(data);
});

module.exports = router;
