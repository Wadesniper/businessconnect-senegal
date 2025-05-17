import jwt from 'jsonwebtoken';

const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
const options: jwt.SignOptions = { expiresIn: jwtExpire };

const token = jwt.sign(
  { id: user._id },
  jwtSecret,
  options
); 