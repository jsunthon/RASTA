var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ticket_schema = new schema
(
  {
    open_date: Date,
    open_day: Number,
    open_month: Number,
    open_year: Number,
    close_date: Date,
    status: Number, // 1: open, 0, closed
    issues: [{ type: schema.Types.ObjectId, ref: 'TestResult' }],
    bad_services: [ { type: schema.Types.ObjectId, ref: 'APICall' }]
  }
);

ticket_schema.pre('save', function (next) {
  this.status = 1;
  this.open_day = this.open_date.getDate();
  this.open_month = this.open_date.getMonth() + 1;
  this.open_year = this.open_date.getFullYear();

  var self = this;

  //console.log(this.issues);
  mongoose.model('TestResult').find({ _id: { $in: this.issues } }, function (err, found_results) {
    if (err) return console.error(err);
    //console.log(found_results);
    self.bad_services = found_results.map(function (result) {
      return result.service_id;
    });
    self.bad_services.sort();
    //console.log(self.bad_services);
    //console.log(self.open_day);
    Ticket.find(
      {
        open_day: self.open_day,
        open_month: self.open_month,
        open_year: self.open_year,
        bad_services: self.bad_services,
        status: 1
      },
      function (err, found_tickets) {
        console.log(found_tickets);
        if (found_tickets[0] == null){
          console.log('not found');
          next();
        }
        else {
          console.log('found');
        }
      }
    )
  });
});

var Ticket = mongoose.model('Ticket', ticket_schema);
module.exports = Ticket;