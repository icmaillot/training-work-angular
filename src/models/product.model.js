import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String  },
  quantity: { type: Number, default: 0 },
  description: { type: String },
  price: { type: Number },
});

const Product = model('Product', productSchema);

export default Product;