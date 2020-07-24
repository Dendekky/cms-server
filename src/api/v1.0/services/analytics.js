const { google } = require('googleapis');
require('dotenv').config();

// http://localhost:5000/api/analytics?metrics=pageviews,users,sessions&dimensions=ga:pagePath,country,browser,userType

const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY.replace(/\n\s+/g, "\n");
const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];

const analytics = google.analytics('v3');
const viewId = process.env.VIEW_ID;
const jwt = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes,
});

async function getMetric(metric, startDate, endDate) {
    await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](
      Math.trunc(1000 * Math.random()),
    ); // 3 sec
    const result = await analytics.data.ga.get({
      auth: jwt,
      ids: `ga:${viewId}`,
      'start-date': startDate,
      'end-date': endDate,
      metrics: metric,
    });

    const res = {};
    res[metric] = {
      metric: parseInt(result.data.totalsForAllResults[metric], 10),
      start: startDate,
      end: endDate,
    };
    return res;
}

async function getDimension(dimension, startDate, endDate) {
    await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](
      Math.trunc(1000 * Math.random()),
    ); // 3 sec
    const result = await analytics.data.ga.get({
      auth: jwt,
      ids: `ga:${viewId}`,
      'start-date': startDate,
      'end-date': endDate,
      dimensions: dimension,
      'metrics': 'ga:sessions'
    });
    // console.log(result.data)
    const res = {};
    res[dimension] = {
      dimension: result.data.rows,
      start: startDate,
      end: endDate,
    };
    return res;
}

function parseMetric(metric) {
    let cleanMetric = metric;
    if (!cleanMetric.startsWith('ga:')) {
        cleanMetric = `ga:${cleanMetric}`;
    }
    return cleanMetric;
}
function parseDimension(dimension) {
    let cleanDimension = dimension;
    if (!cleanDimension.startsWith('ga:')) {
        cleanDimension = `ga:${cleanDimension}`;
    }
    return cleanDimension;
}

function getData(metrics = ['ga:users'], dimensions, startDate = '30daysAgo', endDate = 'today') {
// ensure all metrics have ga:
    const results = [];
    for (let i = 0; i < metrics.length; i += 1) {
        const metric = parseMetric(metrics[i]);
        results.push(getMetric(metric, startDate, endDate));
    }
    for (let i = 0; i < dimensions.length; i += 1) {
        const dimension = parseDimension(dimensions[i]);
        results.push(getDimension(dimension, startDate, endDate));
    }
    return results;
}

module.exports = { getData };