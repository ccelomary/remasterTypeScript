import { NextFunction, Request, Response } from 'express';
import { Student } from '@interfaces/students.interface';
import scanedStudentModel from '@/models/scaned-students.model';
import studentModel from '@/models/students.model';
import flagModel from '@/models/flags.model';
import coalitionModel from '@/models/coalitions.model';
import { Types } from 'mongoose';
import teamModel from '@/models/teams.model';

class StudentsController {
  public Student = studentModel;
  public scanedStudent = scanedStudentModel;
  public Flag = flagModel;
  public Coalition = coalitionModel;
  public Team = teamModel;
  public getCurrentStudent = (req: Request, res: Response) => {
    res.status(200).json((req as any).user);
  };

  public getStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStudentsData: Student[] = await this.Student.find().sort({ points: -1, connections: -1 });
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
  public getStudentPasswordByIntraId = async (req: Request, res: Response) => {
    try {
      const intra_id = parseInt(req.params.intra_id);
      const student = await this.Student.findOne({ intra_id: intra_id });
      if (!student) {
        res.status(201).json({ error: 'Invalid data' });
      } else res.status(200).render('password.ejs', { password: student.pass });
    } catch {
      res.status(201).json({ error: 'Invalid data' });
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
  public getStudentByPassword = async (req: Request, res: Response) => {
    try {
      const password = req.body.password;
      const student = await this.Student.findOne({ pass: password });
      if (!student) res.status(201).json({ success: false, error: 'Invalid Password' });
      else res.status(201).json({ success: true, data: student });
    } catch {
      res.status(201).json({ success: false, error: 'Invalid Password' });
    }
  };
  public ScanQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentScan = req.body.user_id;
      const value = req.body.value;
      if (!studentScan || !value) {
        res.status(201).json({ suceess: false, data: 'Invalid data' });
        return;
      }
      const getfirstStudent = await this.Student.findById(studentScan);

      const hunts = await this.Flag.findById(value);
      if (!getfirstStudent) {
        res.status(201).json({ suceess: false, data: 'Invalid data' });
        return;
      }
      if (hunts) {
        if (hunts.priority !== getfirstStudent.flag_priority) {
          res.status(201).json({ success: false, error: 'Go to other qr code!' });
          return;
        }
        if (!hunts.scaned) {
          if (hunts.last) {
            getfirstStudent.points += hunts.points;
            const coalition = await this.Coalition.findById(getfirstStudent.coalition);
            coalition.points += hunts.points;
            await coalition.save();
            hunts.scaned = true;
          }
          getfirstStudent.flag_priority++;
          await getfirstStudent.save();
          res.status(201).json({ success: true, scaned: 'flag', data: { student: getfirstStudent, flag: hunts } });
        } else {
          res.status(201).json({ success: false, error: 'flag already scaned' });
        }
        return;
      }
      let found = false;
      const getSecondStudent = await this.Student.findOne({ _id: value });
      const getfirstScanedStudents = await this.scanedStudent.findOne({ student: getfirstStudent }).populate('scanedStudents');
      const getsecondScanedStudents = await this.scanedStudent.findOne({ student: getSecondStudent }).populate('scanedStudents');
      if (!getSecondStudent) {
        res.status(201).json({ success: false, error: 'Invalid Data' });
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
        const popluateStudents = getsecondScanedStudents.scanedStudents;
        for (const student of popluateStudents) {
          if (student.login === getSecondStudent.login) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        const coalitionA = await this.Coalition.findById(getfirstStudent.coalition);
        const coalitionB = await this.Coalition.findById(getSecondStudent.coalition);
        coalitionA.points++;
        coalitionB.points++;
        getfirstStudent.connections++;
        getSecondStudent.connections++;
        getfirstScanedStudents.scanedStudents.push(getSecondStudent);
        getsecondScanedStudents.scanedStudents.push(getfirstStudent);
        await getfirstScanedStudents.save();
        await getfirstStudent.save();
        await coalitionA.save();
        await coalitionB.save();
        res.status(201).json({ success: true, scaned: 'student', data: { student: getfirstStudent } });
      } else {
        res.status(406).json({ success: false, error: 'Student Already Scaned' });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default StudentsController;
