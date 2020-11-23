const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('dist'));
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

/*
// This sets up proxying for local development.
// It shouldn't be used on AWS, since the STK server handles the proxying.
const request = require('request');

app.use('/stk', (req, res) => {
  req.pipe(request(`http://aspis.cmpt.sfu.ca/stk-articulations/${req.url}`)).pipe(res);
});
*/

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
