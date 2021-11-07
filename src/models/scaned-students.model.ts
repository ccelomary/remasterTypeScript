import { model, Schema, Document } from 'mongoose';
import { ScanedStudent } from '@/interfaces/scaned-student.interface';

const scanedStudentSchema: Schema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  scanedStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
});

const scanedStudentModel = model<ScanedStudent & Document>('ScanedStudent', scanedStudentSchema);

export default scanedStudentModel;
