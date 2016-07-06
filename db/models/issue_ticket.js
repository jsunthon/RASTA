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
  console.log(this.issues);
  mongoose.model('TestResult').find({_id: this.issues[0]}, function (err, found) {
    console.log(found);
  });
  mongoose.model('TestResult').find({ _id: { $in: this.issues } }, function (err, found_results) {
    if (err) return console.error(err);
    //console.log(found_results);
    this.bad_services = found_results.map(function (result) {
      return result.service_id;
    });
    Ticket.find(
      {
        open_day: this.open_day,
        open_month: this.open_month,
        open_year: this.open_year,
        bad_services: this.bad_services
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