import { Request, Response } from 'express';
import process from 'process';
class IndexController {
  public Index = (req: Request, res: Response) => {
    res.render('connect.ejs');
  };
  public getPassword = (req: Request, res: Response) => {
    res.redirect(`http://${process.env.ADDRESS}:${process.env.PORT}/oauth2/authenticate`);
  };
}

export default IndexController;
