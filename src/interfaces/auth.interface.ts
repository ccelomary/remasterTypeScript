import { Request } from 'express';
import { Student } from '@/interfaces/students.interface';

export interface DataStoredInToken {
  _id: string;
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: Student;
}
