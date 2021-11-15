import { model, Schema, Document } from 'mongoose';
import { scanedFlag } from '@/interfaces/scanedFlag.interface';
/*
    next_place: string;
  image_url: string;
  priority: number;
  points: number;
  scaned: boolean;
*/
const scanedFlagSchema: Schema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  flags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Flag',
    },
  ],
  lastId: Number,
});

const scanedFlagModel = model<scanedFlag & Document>('ScanedFlag', scanedFlagSchema);

export default scanedFlagModel;
