

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

const _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'));

const _asyncToGenerator2 = _interopRequireDefault(require('@babel/runtime/helpers/asyncToGenerator'));

const _nodemailer = _interopRequireDefault(require('nodemailer'));

const _nodeFetch = _interopRequireDefault(require('node-fetch'));

const sendMail =
/* #__PURE__ */
(function () {
  const _ref = (0, _asyncToGenerator2.default)(
  /* #__PURE__ */
    _regenerator.default.mark(function _callee(req, res) {
      let info;
      return _regenerator.default.wrap((_context) => {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              try {
                info = (0, _nodeFetch.default)('http://quotes.rest/qod.json?category=life').then(response => response.json()).catch(err => console.log(err));
                info.then((results) => {
                  const data = results.contents.quotes.map(result => result.quote);
                  let message = '';

                  for (let i = 0; i < data.length; i++) {
                    message += ''.concat(data[i], '!  ');
                  }

                  const transporter = _nodemailer.default.createTransport({
                    service: 'Sendgrid',
                    auth: {
                      user: process.env.SENDGRID_USERNAME,
                      pass: process.env.SENDGRID_PASSWORD,
                    },
                  });

                  transporter.sendMail({
                  // email options
                    from: 'Ibrahim <'.concat(process.env.CRON_EMAIL, '>'),
                    to: ''.concat(process.env.CRON_EMAIL_RECIPIENT),
                    // receiver
                    subject: ''.concat(process.env.CRON_EMAIL_SUBJECT),
                    // subject
                    html: '<div>\n                  <h2>'.concat(process.env.CRON_EMAIL_TITLE, ',</h2> \n                  <h6>').concat(message, '</h6>\n                  <p>').concat(process.env.CRON_EMAIL_CTA, '</p>\n                  </div>'), // body (var data which we've declared)

                  }, (error, response) => {
                  // callback
                    if (error) {
                      console.log(error);
                    } else {
                      res.status(200).send({
                        message: 'message sent successfully',
                      });
                    }
                  });
                });
              } catch (err) {
                res.status(400).send(err);
              }

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );

  return function sendMail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

sendMail();
