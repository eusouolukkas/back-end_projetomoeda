import { Schema, model, Document } from 'mongoose';

enum CoinType {
  National = 'Nacional',
  Foreign = 'Estrangeira',
}

export interface ICoin extends Document {
  country: string;
  value: string;
  year: number;
  information: string;
  type: CoinType;
}

const coinSchema = new Schema<ICoin>({
  country: { type: String, required: true },
  value: { type: String, required: true },
  year: { type: Number, required: true },
  information: { type: String },
  type: { type: String, enum: Object.values(CoinType), required: true },
});

export default model<ICoin>('Coin', coinSchema);
