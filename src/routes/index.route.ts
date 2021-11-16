import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StudentsController from '@/controllers/students.controller';
import FlagController from '@/controllers/flags.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import CoalitionController from '@/controllers/coalition.controller';
import IndexController from '@/controllers/index.controller';
import TeamController from '@/controllers/teams.controller';
class IndexRoute implements Routes {
  public router = Router();
  public studentsController = new StudentsController();
  public flagController = new FlagController();
  public coalitionController = new CoalitionController();
  public indexController = new IndexController();
  public teamController = new TeamController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /* Student */
    this.router.get('/password/:intra_id', this.studentsController.getStudentPasswordByIntraId);
    this.router.get('/students/fetch/all', this.studentsController.getStudents);
    this.router.post('/students/fetch/ids', this.studentsController.getStudentByIds);
    this.router.post('/student/scan/qrcode/', this.studentsController.ScanQrCode);
    this.router.post('/students/fetch/byId/', this.studentsController.getStudentById);
    this.router.get('/students/fetch/:intra_id', authMiddleware, this.studentsController.getStudentByIntraId);
    /* Flag */
    this.router.post('/huntFlag/create', this.flagController.createFlag);
    this.router.post('/huntFlag/check/student', this.studentsController.StudentScanedFlag);
    this.router.post('/huntFlag/getByPriority', this.flagController.getFlagByPriority);
    /* Coalition */
    this.router.get('/coallition/getCoalitions/', this.coalitionController.getCoallitions);
    this.router.post('/coallition/add/points/', this.coalitionController.addPointToGivenCoalition);
    /* Index */
    this.router.get('/', this.indexController.getPassword);
    this.router.get('/getPassword/', this.indexController.getPassword);
    /* Teams */
    this.router.post('/students/fetch/password/', this.studentsController.getStudentByPassword);
    this.router.get('/teams/fetch/byCoalition/:coalition_id', this.teamController.getTeamsByCoalition);
    this.router.get('/temas/fetch/students/byId/:team_id', this.teamController.getStudentsTeam);
    this.router.post('/teams/add/student/', this.teamController.addStudentToTeam);
    this.router.post('/teams/create/team/', this.teamController.createTeam);
  }
}

export default IndexRoute;
