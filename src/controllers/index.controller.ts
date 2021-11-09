import { Request, Response } from 'express';

class IndexController {
  public Index = (req: Request, res: Response) => {
    res.render('connect.ejs');
  };
  public getPassword = (req: Request, res: Response) => {
    res.redirect('/oauth2/authenticate');
  };
}

export default IndexController;
