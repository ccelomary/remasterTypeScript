import { NextFunction, Request, Response } from 'express';
import { Flag } from '@/interfaces/flags.interface';
import flagModel from '@/models/flags.model';

class FlagController {
  public Flag = flagModel;

  public createFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flagName = req.body.flagName;
      const flagValue = req.body.flagValue;
      const flagPoints = parseInt(req.body.flagPoints);
      if (!flagName || !flagValue || !flagPoints) {
        res.status(406).json({ success: false, error: 'Not Valid body' });
      }
      const findFlag: Flag = await this.Flag.findOne({
        value: flagValue,
      });
      if (findFlag) {
        res.status(406).json({ success: false, data: [{ error: 'Flag Aleady Exist' }] });
      } else {
        const newFlag = new this.Flag({ value: flagValue, name: flagName, points: flagPoints, scaned: false });
        await newFlag.save();
        res.status(200).json({ success: true, data: 'flag created!' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default FlagController;
