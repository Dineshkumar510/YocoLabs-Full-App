const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Services/login.service');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return;
  
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const userDetails = {
        username: username,
        password: hashedPassword,
        role : role
      };
      const result = await User.save(userDetails);
      
      res.status(201).json({ message: 'User registered!' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  
  exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const user = await User.find(username);
  
      if (user[0].length !== 1) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
  
      const storedUser = user[0][0];
  
      const isEqual = await bcrypt.compare(password, storedUser.password);
  
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }

      const sessionDuration = 3600;
      const token = jwt.sign(
        {
          username: storedUser.username,
          userId: storedUser.id,
          role: storedUser.role,
          sessionDuration: sessionDuration
        },
        'secretfortoken',
        { expiresIn: '1hr' }
      );

      res.status(200).json({ 
        token: token, 
        userId: storedUser.id, 
        username: storedUser.username, 
        role: storedUser.role,
        sessionDuration: sessionDuration
      });

    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };