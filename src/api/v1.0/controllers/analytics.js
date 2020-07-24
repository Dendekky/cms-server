import { getData } from '../services/analytics'

const gAnalytics = (req, res) => {
    const { metrics, dimensions, startDate, endDate } = req.query;
    // console.log(`Requested metrics: ${metrics}`);
    // console.log(`Requested start-date: ${startDate}`);
    // console.log(`Requested end-date: ${endDate}`);
    Promise.all(getData(metrics ? metrics.split(',') : metrics, dimensions ? dimensions.split(',') : dimensions, startDate, endDate))
      .then((data) => {
        // flatten list of objects into one object
        const body = {};
        Object.values(data).forEach((value) => {
          Object.keys(value).forEach((key) => {
            body[key] = value[key];
          });
        });
        res.status(200).send({ data: body });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ status: 'Error getting a metric', message: `${err}` });
      });
};

module.exports = { gAnalytics }