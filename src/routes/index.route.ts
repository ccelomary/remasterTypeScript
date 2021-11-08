import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StudentsController from '@/controllers/students.controller';
import FlagController from '@/controllers/flags.controller';
class IndexRoute implements Routes {
  public router = Router();
  public studentsController = new StudentsController();
  public flagController = new FlagController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/students/fetch/:intra_id', this.studentsController.getStudentByIntraId);
    this.router.post('/students/fetch/ids', this.studentsController.getStudentByIds);
    this.router.get('/students/fetch/all', this.studentsController.getStudents);
    this.router.post('/huntFlag/create', this.flagController.createFlag);
    this.router.post('/student/scan/qrcode/', this.studentsController.ScanQrCode);
  }
}

export default IndexRoute;
