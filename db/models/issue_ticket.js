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
    issues: [ { type: schema.Types.ObjectId, ref: 'test_result'} ]
  }
);

ticket_schema.pre('save', function (next) {
  this.status = 1;
  this.open_day = this.open_date.getDate();
  this.open_month = this.open_date.getMonth() + 1;
  this.open_year = this.open_date.getFullYear();
  this.model('Ticket').find(
    {
      open_day: this.open_day,
      open_month: this.open_month,
      open_year: this.open_year,
      status: 1
    }, function (found_tickets) {
      if (found_tickets == null) {
        next();
      }
    }
  );
});

ticket_schema.methods.isNew = function () {
  this.model('Ticket').find()
};

var Ticket = mongoose.model('Ticket', ticket_schema);
module.exports = Ticket;