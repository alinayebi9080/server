import { Schema, model, Document } from 'mongoose';

interface ITokenBlackList extends Document {
  token: string;
}

const tokenBlackListSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

const TokenBlackList = model<ITokenBlackList>('TokenBlackList', tokenBlackListSchema);

export default TokenBlackList;
