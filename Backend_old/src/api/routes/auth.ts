import { Router } from 'express';
import { signup } from '../AuthenticationControllers/signup';
import { login } from '../AuthenticationControllers/login';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
