import { NextFunction, Request, Response } from 'express';
import { Student } from '@interfaces/students.interface';
import studentModel from '@/models/students.model';
import { Types } from 'mongoose';

class StudentsController {
  public Student = studentModel;

  public getStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStudentsData: Student[] = await this.Student.find();

      res.status(200).json({ success: true, data: findAllStudentsData });
    } catch (error) {
      next(error);
    }
  };

  public getStudentByIntraId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentIntraId: number = parseInt(req.params.intra_id);
      const findOneStudentData: Student = await this.Student.findOne({
        intra_id: studentIntraId,
      });

      res.status(200).json({ success: true, data: findOneStudentData });
    } catch (error) {
      next(error);
    }
  };

  public getStudentByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentIds: string[] = req.body.ids;
      const findStudentsData: Student[] = await this.Student.find({
        id: { $in: studentIds.map(id => Types.ObjectId(id)) },
      });

      res.status(200).json({ success: true, data: findStudentsData });
    } catch (error) {
      next(error);
    }
  };
}

export default StudentsController;
