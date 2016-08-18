var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ticket_async_schema = new schema
(
  {
    open_date: Date,
    open_day: Number,
    open_month: Number,
    open_year: Number,
    close_date: Date,
    status: Number, // 1: open, 0, closed
    issues: [{ type: schema.Types.ObjectId, ref: 'AsyncTestResult' }],
    bad_services: [ { type: schema.Types.ObjectId, ref: 'AsyncCall' }]
  }
);

ticket_async_schema.pre('save', function (next, done) {
  this.status = 1;
  this.open_day = this.open_date.getDate();
  this.open_month = this.open_date.getMonth() + 1;
  this.open_year = this.open_date.getFullYear();

  var self = this;

  //console.log(this.issues);
  mongoose.model('AsyncTestResult').find({ _id: { $in: this.issues } }, function (err, found_results) {
    if (err) return console.error(err);
    //console.log(found_results);
    self.bad_services = [];

    found_results.forEach(function(result) {
      if (self.bad_services.indexOf(result.service_id) === -1) {
        self.bad_services.push(result.service_id);
      }
    });

    // self.bad_services.sort();
    //console.log(self.bad_services);
    //console.log(self.open_day);
    AsyncTicket.find(
      {
        open_day: self.open_day,
        open_month: self.open_month,
        open_year: self.open_year,
        bad_services: self.bad_services,
        status: 1
      },
      function (err, found_tickets) {
        console.log(JSON.stringify(found_tickets));
        if (found_tickets[0] == null){
          console.log('Async Ticket not found. Adding new Async ticket.');
          next();
        } else if (found_tickets[0]) {
          console.log('Such a async ticket already exists');
          done();
        }
      }
    );
  });
});

var AsyncTicket = mongoose.model('AsyncTicket', ticket_async_schema);
module.exports = AsyncTicket;