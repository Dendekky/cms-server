/* eslint-disable linebreak-style */
const authController = require('../controllers').users;
import { createDraft, getDraft, getAllDrafts, updateDraft} from '../controllers/blogdraft';
const authMiddleware = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the  Beenah API!',
  }));

  app.post('/api/login', authController.login);
  app.post('/api/register', authController.register);
  app.get('/api/users', authController.userList);
  app.post('/api/draft', createDraft);
  app.get('/api/draft/:id', getDraft);
  app.put('/api/draft/:id', updateDraft);
  app.get('/api/draft', getAllDrafts);
  app.get('/api/checkToken', authMiddleware.checkAuth, (req, res) => {
    res.sendStatus(200);
  });
};
