import { NextFunction, Request, Response } from 'express';
import { Flag } from '@/interfaces/flags.interface';
import flagModel from '@/models/flags.model';

class FlagController {
  public Flag = flagModel;
  public createFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const next_place = req.body.next_place;
      const image_url = req.body.image_url;
      const priority = parseInt(req.body.priority);
      const points = parseInt(req.body.points);
      const last = parseInt(req.body.last);
      if (!next_place || !image_url || !priority || !points || !last) {
        res.status(201).json({ success: false, error: 'Not Valid body' });
      }
      const findFlag: Flag = await this.Flag.findOne({
        next_place: next_place,
      });
      if (findFlag) {
        res.status(201).json({ success: false, data: [{ error: 'Flag Aleady Exist' }] });
      } else {
        const newFlag = new this.Flag({ next_place: next_place, image_url: image_url, priority: priority, scaned: false, last: last });
        await newFlag.save();
        res.status(200).json({ success: true, data: 'flag created!' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default FlagController;
