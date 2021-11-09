import { model, Schema, Document } from 'mongoose';
import { Team } from '@interfaces/teams.interface';

const teamSchema: Schema = new Schema({
  name: String,
  coalition: {
    type: Schema.Types.ObjectId,
    ref: 'Coalition',
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
});

const teamModel = model<Team & Document>('Team', teamSchema);

export default teamModel;
