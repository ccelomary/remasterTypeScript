import { model, Schema, Document } from 'mongoose';
import { Flag } from '@/interfaces/flags.interface';
/*
    next_place: string;
  image_url: string;
  priority: number;
  points: number;
  scaned: boolean;
*/
const flagSchema: Schema = new Schema({
  next_place: String,
  image_url: String,
  priority: Number,
  points: Number,
  scaned: Boolean,
  last: Boolean,
});

const flagModel = model<Flag & Document>('Flag', flagSchema);

export default flagModel;
