import { NextFunction, Request, Response } from 'express';
import { Flag } from '@/interfaces/flags.interface';
import flagModel from '@/models/flags.model';

class FlagController {
  public Flag = flagModel;
  public createFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const next_place = req.body.next_place;
      const priority = parseInt(req.body.priority);
      const points = parseInt(req.body.points);
      const last = parseInt(req.body.last);
      const type: string = req.body.type;
      const description = req.body.description;
      if (
        next_place === undefined ||
        priority === undefined ||
        points === undefined ||
        last === undefined ||
        type === undefined ||
        description === undefined
      ) {
        res.status(201).json({ success: false, error: 'Not Valid body' });
        return;
      }
      const findFlag: Flag = await this.Flag.findOne({
        next_place: next_place,
      });
      if (findFlag) {
        res.status(201).json({ success: false, data: [{ error: 'Flag Aleady Exist' }] });
      } else {
        const newFlag = new this.Flag({
          next_place: next_place,
          priority: priority,
          type: type,
          scaned: false,
          last: last,
          points: points,
          description: description,
        });
        await newFlag.save();
        res.status(200).json({ success: true, data: 'flag created!' });
      }
    } catch (error) {
      next(error);
    }
  };
  public getFlagByPriority = async (req: Request, res: Response) => {
    try {
      const priority = parseInt(req.body.priority);
      const flag = await this.Flag.findOne({ priority: priority });
      if (flag) res.status(201).json({ success: true, data: flag });
      else res.status(201).json({ success: false, error: 'Flag Not Found' });
    } catch (error) {
      res.status(201).json({ success: false, error: 'You Have to register in a team' });
    }
  };
}

export default FlagController;
