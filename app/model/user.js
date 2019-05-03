'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPass: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userAge: {
      type: String
    },
    userSex: {
      type: String
    },
    userPhote: {
      type: String
    },
  });
  return mongoose.model('User', UserSchema);
};
