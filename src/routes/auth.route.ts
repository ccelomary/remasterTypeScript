import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';

import AuthController from '@controllers/auth.controller';

class AuthRoute implements Routes {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/oauth2/authenticate', this.authController.authenticate);
    this.router.get('/oauth2/redirect', this.authController.callbackRedirect);
    this.router.get('/oauth2/callback', this.authController.callback);
  }
}

export default AuthRoute;
