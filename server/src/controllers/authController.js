import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};
