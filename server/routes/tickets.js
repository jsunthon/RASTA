var TicketDbManager = require('../database/managers/TicketDb.js');
var moment = require('moment');

/* This anonymous function that contains all the routes related
 * to the ticket system
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function(app) {
    var ticketDbInst = TicketDbManager;

    //Get a list of all the tickets opened
    app.get('/api/getTickets', function (req, res) {
        var promise = ticketDbInst.retrieveTickets();
        promise.then(function (tickets) {
            var formattedTickets = tickets.map(function (ticket) {
                var ticketDate = ticket.open_date;
                var date = moment(ticketDate).format('MMMM Do YYYY, h:mm:ss a');
                var formattedTicket = {
                    id: ticket._id,
                    dateOpened: date,
                    issues: ticket.issues,
                    badServices: ticket.bad_services
                };
                return formattedTicket;
            });

            ticketDbInst.retrieveAsyncTickets().then(function(foundAsyncTickets) {
                var formattedAsyncTickets = foundAsyncTickets.map(function (ticket) {
                    var ticketDate = ticket.open_date;
                    var date = moment(ticketDate).format('MMMM Do YYYY, h:mm:ss a');
                    var formattedTicket = {
                        id: ticket._id,
                        dateOpened: date,
                        issues: ticket.issues,
                        badServices: ticket.bad_services
                    };
                    return formattedTicket;
                });
                res.send(JSON.stringify({tickets: formattedTickets, asyncTickets: formattedAsyncTickets}));
            });
        });
    });

    //Given an id, close the ticket of that id
    app.get('/api/closeTicket/:id', function (req, res) {
        ticketDbInst.closeATicket(req.params.id)
            .then(function(code){
                res.sendStatus(code)
            });
    });

    //Given an id, close the async ticket of that id
    app.get('/api/closeAsyncTicket/:id', function (req, res) {
        console.log('hi: ' + req.params.id);
        ticketDbInst.closeAsyncTicket(req.params.id)
          .then(function(code){
              res.sendStatus(code)
          });
    });
}