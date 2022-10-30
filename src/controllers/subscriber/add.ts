import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Subscriber from '../..//models/Subscriber';
import validate from 'deep-email-validator';
import logger from '../../logger';

// export const addBookSchema = Joi.object().keys({
//     name: Joi.string().required(),
//     author: Joi.string().required()
// });

interface AddReqBody {
    email: string;
}

const add: RequestHandler = async(req: Request, res) => {
    const { email } = req.body;

    // check if the email already in the database.
    const isSubscriber = await Subscriber.findOne({email}).exec()
    if(isSubscriber != null) {
        res.send({
            message: "already subscriber"
        });
        return;
    }

    // validate email address
    const validation = await validate({
        email,
        validateRegex: true,
        validateMx: true,
        validateTypo: false,
        validateDisposable: true,
        validateSMTP: true,
    })

    if(!validation.valid) {
        res.send({
            message: `failed validation: ${validation.reason}`
        });
        return;
    }

    logger.debug(JSON.stringify(validation))
    // end validate email address

    const subscriber = new Subscriber({ email })
    await subscriber.save()

    res.send({
        message: 'ok',
        subscriber: subscriber.toJSON()
    });
}

export default requestMiddleware(add, {});
