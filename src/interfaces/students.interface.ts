import { Coalition } from '@interfaces/coalitions.interface';
import { Team } from './teams.interface';
export interface Student {
  intra_id: number;
  name: string;
  pass: string;
  flag_priority: number;
  login: string;
  image_url: string;
  connections: number;
  points: number;
  coalition: Coalition;
  team: Team;
}
