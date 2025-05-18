import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  githubId: {
    type: String,
    required: true,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
    default: []
  }]
}, { timestamps: true });

export const User = models.User || model('User', userSchema);
