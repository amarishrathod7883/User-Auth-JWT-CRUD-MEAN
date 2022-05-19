var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
  user_role_id:{
      type:Schema.Types.ObjectId,
      ref:'UserRole',
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  profileimage: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  }
}, { collection: 'user'});

module.exports = mongoose.model("User", userSchema);