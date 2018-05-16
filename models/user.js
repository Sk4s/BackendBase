// The user model that we define will be used when creating and getting users.

// Méthode 1 (tuto) : Pas de cryptage du password
// import mongoose from 'mongoose'
// let Schema = mongoose.Schema

// // Set up a mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({
//   username: String,
//   email: String,
//   password: String
//   // admin: Boolean
// }))

// Méthode 2 : Cryptage du password
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // admin: { type: Boolean, default: true },
  },
  { timestamps: true }
)

Schema.methods.comparePasswords = function (reqPassword) {
  return bcrypt.compareSync(reqPassword, this.password)
}

export default mongoose.model('User', Schema)
