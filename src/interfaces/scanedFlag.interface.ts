import { Student } from '@interfaces/students.interface';
import { Flag } from '@interfaces/flags.interface';
export interface scanedFlag {
  student: Student;
  flags: Flag[];
  lastId: number;
}
