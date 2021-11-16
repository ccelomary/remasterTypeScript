import { Coalition } from '@interfaces/coalitions.interface';
import { Student } from '@interfaces/students.interface';
export interface Team {
  name: string;
  coalition: Coalition;
  students: Student[];
  points: number;
  priority: number;
}
