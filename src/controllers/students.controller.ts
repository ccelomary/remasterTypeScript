import { NextFunction, Request, Response } from 'express';
import { Student } from '@interfaces/students.interface';
import scanedStudentModel from '@/models/scaned-students.model';
import studentModel from '@/models/students.model';
import flagModel from '@/models/flags.model';
import coalitionModel from '@/models/coalitions.model';
import { Types } from 'mongoose';

class StudentsController {
  public Student = studentModel;
  public scanedStudent = scanedStudentModel;
  public Flag = flagModel;
  public Coalition = coalitionModel;
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
  public ScanQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentScan = req.body.user_id;
      const value = req.body.value;
      if (!studentScan || !value) {
        res.status(406).json({ suceess: false, data: 'Invalid data' });
        return;
      }
      const getfirstStudent = await this.Student.findById(studentScan);
      const getfirstScanedStudents = await this.scanedStudent.findOne({ student: getfirstStudent }).populate('scanedStudents');
      const hunts = await this.Flag.findOne({ value: value });
      if (!getfirstStudent) {
        res.status(406).json({ suceess: false, data: 'Invalid data' });
        return;
      }
      if (hunts) {
        if (!hunts.scaned) {
          getfirstStudent.points += hunts.points;
          const coalition = await this.Coalition.findById(getfirstStudent.coalition);
          coalition.points += hunts.points;
          await getfirstStudent.save();
          await coalition.save();
          res.status(201).json({ success: true, data: getfirstStudent });
        } else {
          res.status(406).json({ success: false, error: 'flag already scaned' });
        }
        return;
      }
      let found = false;
      const getSecondStudent = await this.Student.findOne({ _id: value });
      if (!getSecondStudent) {
        res.status(406).json({ success: false, error: 'Invalid Data' });
        return;
      }
      const popluateStudents = getfirstScanedStudents.scanedStudents;
      for (const student of popluateStudents) {
        if (student.login === getSecondStudent.login) {
          found = true;
          break;
        }
      }
      if (!found) {
        const coalition = await this.Coalition.findById(getfirstStudent.coalition);
        coalition.points++;
        getfirstStudent.connections += 1;
        getfirstScanedStudents.scanedStudents.push(getSecondStudent);
        await getfirstScanedStudents.save();
        await getfirstStudent.save();
        await coalition.save();
        res.status(201).json({ success: true, data: [{ user: getfirstStudent, value: value }] });
      } else {
        res.status(406).json({ success: false, error: 'Student Already Scaned' });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default StudentsController;
