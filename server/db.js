// MongoDB connection + models. The connection is cached so warm serverless invocations reuse it.
import mongoose from 'mongoose';

let conn = null;
export async function connect() {
  if (conn && mongoose.connection.readyState === 1) return conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 });
  return conn;
}

const { Schema, model, models } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    tokenVersion: { type: Number, default: 0 }, // bump to log a user out everywhere
  },
  { timestamps: true }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    date: { type: Date, default: Date.now, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    image: { src: String, alt: String, width: Number, height: Number },
    seo: { title: String, description: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Failed logins, auto-deleted after 15 minutes (used for rate limiting)
const LoginAttemptSchema = new Schema({ key: { type: String, index: true }, at: { type: Date, default: Date.now, expires: 900 } });

export const User = models.User || model('User', UserSchema);
export const Category = models.Category || model('Category', CategorySchema);
export const Post = models.Post || model('Post', PostSchema);
export const LoginAttempt = models.LoginAttempt || model('LoginAttempt', LoginAttemptSchema);

export const slugify = (s = '') =>
  s.toString().normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'post';
