var superagent = require('superagent');

module.exports = function (app)
{
  app.get('api/:keyword', function(req, res)
  {
    superagent
      .get()
  }
  )
}