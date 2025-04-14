import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject, ZodEffects, z } from "zod";

export const validateSchema = (schema: AnyZodObject | ZodEffects<AnyZodObject>): RequestHandler => {
    return (async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            return next();
        } catch (error) {
            if(error instanceof z.ZodError){
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }

            return next(error);
        }
    }) as RequestHandler;
};