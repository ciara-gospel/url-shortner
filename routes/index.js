//routes/index

import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.send( 'Welcome to the API' );
});

export default router;