// Create (or reset the password of) an admin user:
//   npm run create-admin -- you@example.com "a-long-password" "Your Name"
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connect, User } from '../server/db.js';

const [email, password, name = 'Admin'] = process.argv.slice(2);
if (!email || !password || password.length < 10) {
  console.error('Usage: npm run create-admin -- email "password (10+ chars)" "Name"');
  process.exit(1);
}
await connect();
const passwordHash = await bcrypt.hash(password, 12);
const u = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { $set: { passwordHash, name, role: 'admin' }, $inc: { tokenVersion: 1 } },
  { upsert: true, new: true }
);
console.log(`Admin ready: ${u.email}`);
await mongoose.disconnect();
