import { model, Schema, Document } from 'mongoose';
import { Student } from '@/interfaces/students.interface';

const studentSchema: Schema = new Schema({
  intra_id: Number,
  flag_priority: Number,
  login: String,
  name: String,
  image_url: String,
  pass: String,
  connections: Number,
  points: Number,
  coalition: {
    type: Schema.Types.ObjectId,
    ref: 'Coalition',
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
});

const studentModel = model<Student & Document>('Student', studentSchema);

export default studentModel;
