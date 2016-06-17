var superagent = require('superagent');

module.exports = function (app)
{
  app.get('*', function (req, res) {
    res.sendFile('public/views/index.html', { root: __dirname });
  });
};