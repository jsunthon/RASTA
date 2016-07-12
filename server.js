var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var initDb = require('./server/database/managers/dbInit.js');
var morgan = require('morgan');
var passport = require('passport');
var port = process.env.PORT || 8080;
var Tester = require('./server/logic/tester');
require('./server/routes/api.js')(app);
require('./server/routes/config.js')(app);
require('./server/routes/email.js')(app);
require('./server/routes/testing.js')(app);
require('./server/routes/tickets.js')(app);
require('./server/routes/user.js')(app);
require('./server/config/passport')(passport);

app.use(express.static('client/public'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('dev'));
app.use(passport.initialize());
app.get('*', function (req, res) {
    res.sendFile('client/public/views/index.html', { root: __dirname });
});
// Start the server
app.listen(port, function () {
    console.log('Server is running on port:' + port);
    startScheduledTests(function () {
        var tester = new Tester();
        tester.startScheduledTests();
    });
});

function startScheduledTests(testSetup) {
    testSetup();
    setInterval(testSetup, 10000);
}

// Testing of the email sending
// var emailGen = require('./server/logic/EmailGenerator.js');
// emailGen.sendEmail();



