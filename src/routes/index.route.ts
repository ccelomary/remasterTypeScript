import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StudentsController from '@/controllers/students.controller';

class IndexRoute implements Routes {
  public router = Router();
  public studentsController = new StudentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/students/fetch/:intra_id', this.studentsController.getStudentByIntraId);
    this.router.post('/students/fetch/ids', this.studentsController.getStudentByIds);
    this.router.get('/students/fetch/all', this.studentsController.getStudents);
  }
}

export default IndexRoute;
