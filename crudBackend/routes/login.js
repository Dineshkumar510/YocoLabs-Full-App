const express = require('express');
const router = express.Router();
const User = require('../Services/login.service');
const authController = require('../Controller/auth');

const { body } = require('express-validator');

router.post(
  '/signup',
  [
    body('username')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (username) => {
        const user = await User.find(username);
        if (user[0].length > 0) {
          return Promise.reject('Email address already exist!');
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 7 })
      .withMessage('Password must be at least 7 characters long.'),
    body('role')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Role is required.')
      .isIn(['admin', 'user'])
      .withMessage('Invalid role. Role must be either "admin" or "user".'),
  ],
  authController.signup
);


router.post('/login', authController.login);


router.delete('/:id', async (req, res) => {
  const affectedRows = await User.deleteUser(req.params.id)
  if (affectedRows == 0)
      res.status(404).json('no record with given id : ' + req.params.id)
  else
      res.send('deleted successfully.')
})

module.exports = router;
