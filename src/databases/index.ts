import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const { username, password, host, database }: dbConfig = config.get('dbConfig');

export const dbConnection = {
  url: `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
