import { Student } from '@interfaces/students.interface';

export interface Coalition {
  intra_id: number;
  name: string;
  color: string;
  image_url: string;
  cover_url: string;
  points: number;
  students: Student[];
}
