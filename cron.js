"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

exports.sendMail =
/*#__PURE__*/
function () {
  console.log('cron running');
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var info;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              console.log("process got to try block");
              info = (0, _nodeFetch["default"])('http://quotes.rest/qod.json?category=love').then(function (response) {
                return response.json();
              })["catch"](function (err) {
                return console.log(err);
              });
              console.log(info);
              info.then(function (results) {
                var data = results.contents.quotes.map(function (result) {
                  return result.quote;
                });
                console.log(data);
                var message = '';

                for (var i = 0; i < data.length; i++) {
                  message += "".concat(data[i], "!  ");
                }

                var transporter = _nodemailer["default"].createTransport({
                  service: 'Sendgrid',
                  auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                  }
                });

                transporter.sendMail({
                  // email options
                  from: "Ibrahim <".concat(process.env.CRON_EMAIL, ">"),
                  to: 'Lover <dendekky@gmail.com>',
                  // receiver
                  subject: 'My Daily Love Snippet',
                  // subject
                  html: "<div>\n                  <h2>Hello Love,</h2>\n                  <h6>".concat(message, "</h6>\n                  <p>What do you think?</p>\n                  </div>") // body (var data which we've declared)

                }, function (error, response) {
                  // callback
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Message sent');
                    res.status(200).send({
                      message: 'message sent successfully'
                    });
                  }
                });
              });
            } catch (err) {
              res.status(400).send(err);
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();