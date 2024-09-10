import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, age, gender } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};