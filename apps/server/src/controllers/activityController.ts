import { Request, Response } from 'express';

export const logActivity = async (req: Request, res: Response) => {
  try {
    const { coordinates } = req.body;
    res.json('Under Construction');
  } catch (error) {
    console.log(error);
  }
};
