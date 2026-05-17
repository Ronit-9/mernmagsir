import express from 'express';
import { register, login } from '../controller/authController.js';
import { methodNotAllow } from '../utils/methodNotAllow.js';
const router = express.Router();

router.route("/register")
  .post(register).all(methodNotAllow);

router.route("/login")
  .post(login).all(methodNotAllow);

export default router;