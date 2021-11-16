import { Request, Response } from 'express';
import coalitionModel from '@/models/coalitions.model';
import studentModel from '@/models/students.model';
import teamModel from '@/models/teams.model';
import { Student } from '@/interfaces/students.interface';

class TeamController {
  private Student = studentModel;
  private Team = teamModel;
  private Coalition = coalitionModel;

  public getTeamsByCoalition = async (req: Request, res: Response) => {
    try {
      const coalition_id = req.params.coalition_id;
      const coalition = await this.Coalition.findById(coalition_id).populate('teams');
      if (!coalition) {
        res.status(201).json({ success: false, error: 'Invalid Data' });
      } else {
        res.status(201).json({ success: true, data: coalition.teams });
      }
    } catch (err) {
      res.status(201).json({ success: false, error: 'Invalid Data' });
    }
  };

  public getStudentsTeam = async (req: Request, res: Response) => {
    try {
      const team_id = req.params.team_id;
      const team = await this.Team.findById(team_id).populate('students');
      if (!team) {
        res.status(201).json({ success: false, error: 'Invalid data' });
      } else {
        res.status(201).json({ success: true, data: team.students });
      }
    } catch (err) {
      res.status(201).json({ success: false, error: 'Invalid data' });
    }
  };
  public addStudentToTeam = async (req: Request, res: Response) => {
    try {
      const team_name = req.body.team_name;
      const student_login = req.body.student_login;
      const team = await this.Team.findOne({ name: team_name }).populate('coalition').populate('students');
      const student = await this.Student.findOne({ login: student_login }).populate('coalition');
      if (!student || !team) {
        res.status(201).json({ success: false, error: 'Team OR Student Not Found' });
        return;
      }
      if (team.coalition.intra_id !== student.coalition.intra_id) {
        res.status(200).json({ success: false, error: 'user not belong to the coalition of this team' });
        return;
      }
      if (this.StudentAlreadyInTeam(student.intra_id, team.students)) {
        res.status(201).json({ success: false, error: 'Student Already In Team' });
        return;
      }
      team.students.push(student);
      await team.save();
      student.team = team;
      await student.save();
      res.status(201).json({ success: true, data: 'User Added To Team' });
    } catch (error) {
      res.status(201).json({ success: false, error: 'Invalid Data' });
    }
  };

  public createTeam = async (req: Request, res: Response) => {
    try {
      const team_name = req.body.team_name;
      const coalition_name = req.body.coalition_name;
      const coalition = await this.Coalition.findOne({ name: coalition_name });
      const checkTeam = await this.Team.findOne({ name: team_name });
      if (checkTeam) {
        res.status(201).json({ success: false, error: 'Team already exist in this coaliton' });
        return;
      }
      const team = new this.Team({ name: team_name, coalition: coalition, priority: 0, points: 0 });
      await team.save();
      if (!coalition.teams) coalition.teams = [];
      coalition.teams.push(team);
      await coalition.save();
      res.status(201).json({ success: true, data: 'Team Created Successfully!' });
    } catch (error) {
      res.status(201).json({ success: false, error: 'Invalid Data' });
    }
  };
  private StudentAlreadyInTeam = (student_intra_id: number, students: Student[]) => {
    for (const student of students) {
      if (student.intra_id === student_intra_id) return true;
    }
    return false;
  };
}

export default TeamController;
