var EmailDbManager = require('../database/managers/EmailDb.js');
var emailjs = require("emailjs");
var TicketDbManager = require('../database/managers/TicketDb.js');
var moment = require("moment");

function EmailGenerator() {

  var emailDbInst = EmailDbManager;
  var ticketDbInst = TicketDbManager;

  this.sendEmail = function (ticketType) {
    emailDbInst.getEmailRecipientStr().then(function (toEmailsStr) {
      generateHtml(ticketType).then(function (htmlBody) {
        console.log("Sending the following to: " + toEmailsStr);
        console.log(htmlBody);
        createEmail(toEmailsStr, htmlBody);
      });
    });
  }
  /**
   * Create an email and send it to toEmails
   * @param toEmails
   *                  Email addr to send emails to
   */
  var createEmail = function (toEmails, htmlBody) {
    var server = emailjs.server.connect({
      user: "",
      password: "",
      host: "smtp.jpl.nasa.gov",
      ssl: true
    });

    var message = {
      text: "Here are the current open tickets for the LMMP web services",
      from: "noreply@rasta.jpl.nasa.gov",
      to: toEmails,
      //cc:      "else <else@your-emailjs.com>",
      subject: "RASTA: Current Web Service Tickets",
      attachment: [
        {data: htmlBody, alternative: true}
        //{path: "../RASTA/sample.json", type: "application/json", name: "renamed.json"}
      ]
    };

    server.send(message, function (err, message) {
      console.log(err || message);
    });
  }

  var generateHtml = function (ticketType) {
    return new Promise(function (resolve, reject) {
      var startHtml = "<html><body>";
      ticketDbInst.retrieveTickets().then(function (tickets) {
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
        var finalHtml = "";
        formattedTickets.forEach(function (ticket) {
          var dateHeader = "<h3>" + "Date Opened: " + ticket.dateOpened + "</h3>";
          var issueHeader = "<h3>" + "Issues" + "</h3>";
          var startTable = generateAppropriateTable(ticket.issues, "sync");
          console.log(ticket);
          var finalTable = startTable + "</tbody></table>";
          finalHtml = finalHtml + dateHeader + issueHeader + finalTable + "<hr>";
        });
        ticketDbInst.retrieveAsyncTickets().then(function (tickets) {
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
          formattedTickets.forEach(function (ticket) {
            var dateHeader = "<h3>" + "Date Opened: " + ticket.dateOpened + "</h3>";
            var issueHeader = "<h3>" + "Issues" + "</h3>";
            var startTable = generateAppropriateTable(ticket.issues, "async");
            console.log(ticket);
            var finalTable = startTable + "</tbody></table>";
            finalHtml = finalHtml + dateHeader + issueHeader + finalTable + "<hr>";
          });
          resolve(startHtml + finalHtml + "</body></html>");
        });
      });
    });
  }

  function generateAppropriateTable(issues, type) {
    var startTable;
    if (type === "sync") {
      startTable = "<table><thead><th>Service</th><th>Url</th>" +
        "<th>Status code</th><th>Response Time</th><th>Response Type" +
        "</th><th>Result</th></thead><tbody>";
      issues.forEach(function (issue) {
        var name = issue.service_name;
        var url = issue.service_id.url;
        var statusCode = issue.status_code;
        var responseTime = issue.response_time + " ms";
        var responseType = issue.service_id.response_type;
        var testResult = issue.test_result;
        var columns = "<td>" + name + "</td>" + "<td>" + url + "</td>" + "<td>" + statusCode + "</td>" + "<td>" + responseTime + "</td>" + "<td>"
          + responseType + "</td>" + "<td>" + testResult + "</td>";
        var row = "<tr>" + columns + "</tr>";
        startTable = startTable + row;
      });
    } else if(type === "async") {
      startTable = "<table><thead><th>Service</th>" + "<th>Status code</th><th>Response Time</th><th>Result</th></thead><tbody>";
      issues.forEach(function (issue) {
        var name = issue.service_name;
        var statusCode = issue.status_code;
        var responseTime = issue.response_time.toFixed(2) + " hrs";
        var testResult = issue.test_result;
        var columns = "<td>" + name + "</td>" + "<td>" + statusCode + "</td>" + "<td>" + responseTime + "</td>" + "<td>" + testResult + "</td>";
        var row = "<tr>" + columns + "</tr>";
        startTable = startTable + row;
      });
    }
    return startTable;
  }
}
module.exports = new EmailGenerator();