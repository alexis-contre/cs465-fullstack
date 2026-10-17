const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('users');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'A user with that email already exists',
      });
    }

    const user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    await user.save();

    const token = user.generateJwt();

    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json(err);
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  passport.authenticate(
    'local',
    {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return res.status(404).json(err);
      }

      if (user) {
        const token = user.generateJwt();

        return res.status(200).json({
          token,
        });
      }

      return res.status(401).json(info);
    },
  )(req, res);
};

module.exports = {
  register,
  login,
};
