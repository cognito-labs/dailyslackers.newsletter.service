import {
    Model, Schema, model, Document
} from 'mongoose';

export interface ISubscriber extends Document {
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }

interface ISubscriberModel extends Model<ISubscriber>{}

const schema = new Schema<ISubscriber>({
    email: { type: String, index: true, required: true },
}, { timestamps: true });

const Subscriber : ISubscriberModel = model<ISubscriber, ISubscriberModel>("Subscriber", schema);

export default Subscriber;