import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StudentsController from '@/controllers/students.controller';
import FlagController from '@/controllers/flags.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import CoalitionController from '@/controllers/coalition.controller';
import IndexController from '@/controllers/index.controller';
class IndexRoute implements Routes {
  public router = Router();
  public studentsController = new StudentsController();
  public flagController = new FlagController();
  public coalitionController = new CoalitionController();
  public indexController = new IndexController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/students/me', authMiddleware, this.studentsController.getCurrentStudent);
    this.router.get('/password/:intra_id', this.studentsController.getStudentPasswordByIntraId);
    this.router.get('/students/fetch/all', this.studentsController.getStudents);
    this.router.post('/students/fetch/ids', authMiddleware, this.studentsController.getStudentByIds);
    this.router.get('/students/fetch/:intra_id', authMiddleware, this.studentsController.getStudentByIntraId);
    this.router.post('/huntFlag/create', authMiddleware, this.flagController.createFlag);
    this.router.post('/student/scan/qrcode/', authMiddleware, this.studentsController.ScanQrCode);
    this.router.get('/coallition/getCoalitions/', this.coalitionController.getCoallitions);
    this.router.get('/', this.indexController.Index);
    this.router.get('/getPassword/', this.indexController.getPassword);
    this.router.post('/students/fetch/password/', this.studentsController.getStudentByPassword);
  }
}

export default IndexRoute;
