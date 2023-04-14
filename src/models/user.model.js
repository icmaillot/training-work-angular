import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  pseudo: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  purchases: [
    {
      products: [{type: Schema.Types.ObjectId, ref: 'Product'} ],
      totalPrice: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
