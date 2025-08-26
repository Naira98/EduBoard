import { NextFunction, Request, Response } from "express";

export const asyncHandler = (
  middleware: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await middleware(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
