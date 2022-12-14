import {
    RequestHandler, Request, Response, NextFunction
} from 'express';
import logger from '../logger';


interface HandlerOptions {
    validation?: {
      body?: any // Joi.ObjectSchema
    }
};

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 * @param handler Request handler to check for error
 */
 export const requestMiddleware = (
    handler: RequestHandler,
    options?: HandlerOptions,
  ): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
    // if (options?.validation?.body) {
    //   const { error } = options?.validation?.body.validate(req.body);
    //   if (error != null) {
    //     next(new BadRequest(getMessageFromJoiError(error)));
    //     return;
    //   }
    // }

    try {
      handler(req, res, next);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        logger.log({
          level: 'error',
          message: 'Error in request handler',
          error: err
        });
      }
      next(err);
    };
  };

  export default requestMiddleware;