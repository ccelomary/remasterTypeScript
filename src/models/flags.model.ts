import { model, Schema, Document } from 'mongoose';
import { Flag } from '@/interfaces/flags.interface';

const flagSchema: Schema = new Schema({
  name: String,
  value: String,
  points: Number,
  scaned: Boolean,
});

const flagModel = model<Flag & Document>('Flag', flagSchema);

export default flagModel;
