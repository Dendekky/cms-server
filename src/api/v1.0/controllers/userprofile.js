import UserProfile from '../models/userprofile';

exports.updateProfile = (req, res) => {
  try {
    UserProfile.update(
      {}, req.body,
      { upsert: true, setDefaultsOnInsert: true }, (err, info) => {
        if (err) {
          res.status(500).send({
            message: 'Internal server error',
          });
        }
        res.status(201).send({
          message: 'update successful',
        });
      },
    );
  } catch (error) {
    console.error(error);
  }
};

exports.getProfile = (req, res) => UserProfile.find({}, (err, userprofile) => {
  if (err) {
    res.status(500).send({
      status: 500,
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    status: 200,
    userprofile,
  });
});
