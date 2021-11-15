import { model, Schema, Document } from 'mongoose';
import { Coalition } from '@/interfaces/coalitions.interface';

const coalitionSchema: Schema = new Schema({
  intra_id: Number,
  name: String,
  color: String,
  image_url: String,
  cover_url: String,
  points: Number,
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
  teams: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
  ],
});

const coalitionModel = model<Coalition & Document>('Coalition', coalitionSchema);

export default coalitionModel;
