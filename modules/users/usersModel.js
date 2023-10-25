const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true, index: { unique: true } },
    password: { type: String, required: true, },
    type: { type: String, default: 'user' },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    stripeId: { type: String, required: false },
  },
  { timestamps: true }
);


const User = mongoose.model('user', UserSchema);

module.exports = User;