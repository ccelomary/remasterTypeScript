import { Coalition } from '@interfaces/coalitions.interface';

export interface Student {
  intra_id: number;
  name: string;
  login: string;
  image_url: string;
  connections: number;
  points: number;
  coalition: Coalition;
}