import { Request, Response, NextFunction } from 'express';

interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): Promise<any> | any;
}

const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export {asyncHandler}