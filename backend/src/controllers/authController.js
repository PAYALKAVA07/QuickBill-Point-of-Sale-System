const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const signToken = (user) => {
  return jwt.sign({ id: user.id, roleId: user.roleId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

exports.register = async (req, res, next) => {
  try{
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ name, email, password: hash });
    res.json({ user: { id: user.id, email: user.email } });
  }catch(err){ next(err); }
};

exports.login = async (req, res, next) => {
  try{
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if(!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, roleId: user.roleId } });
  }catch(err){ next(err); }
};

exports.getProfile = async (req, res, next) => {
  try{
    const user = await db.User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json({ user });
  }catch(err){ next(err); }
};

exports.changePassword = async (req, res, next) => {
  try{
    const user = await db.User.findByPk(req.user.id);
    const { oldPassword, newPassword } = req.body;
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok) return res.status(400).json({ message: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  }catch(err){ next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try{
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if(!user) return res.status(404).json({ message: 'No user' });
    // For production: send reset token via email. Here we return a token for simplicity.
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ resetToken: token });
  }catch(err){ next(err); }
};

// Protect middleware
exports.protect = async (req, res, next) => {
  try{
    let token = null;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }
    if(!token) return res.status(401).json({ message: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, roleId: decoded.roleId };
    next();
  }catch(err){ return res.status(401).json({ message: 'Invalid token' }); }
};
