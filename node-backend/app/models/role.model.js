var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userRoleSchema = new Schema({
  role_name: {
      type: String
  },
  is_active: {
      type: Number, // 0: inactive, 1: active,
      //default: 1
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  }
}, { collection: 'user_role' });

module.exports = mongoose.model("UserRole", userRoleSchema);