import { model, Schema, Document } from 'mongoose';
import { Student } from '@/interfaces/students.interface';

const studentSchema: Schema = new Schema({
  intra_id: Number,
  login: String,
  name: String,
  image_url: String,
  connections: Number,
  points: Number,
  coalition: {
    type: Schema.Types.ObjectId,
    ref: 'Coalition',
  },
});

const studentModel = model<Student & Document>('Student', studentSchema);

export default studentModel;
