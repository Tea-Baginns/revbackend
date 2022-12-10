import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export type INews = {
  title_en: string;
  title_np: string;
  content_en: string;
  content_np: string;
  audio_en: string;
  audio_np: string;
  category: string[];
  author: string;
  upvotes: string[];
  downvotes: String[];
} & Document;

const newsSchema = new mongoose.Schema(
  {
    title_en: String,
    title_np: String,

    content_en: String,
    content_np: String,

    audio_en: String,
    audio_np: String,

    category: [String],

    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    upvotes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

const News: Model<INews> = mongoose.model<INews>('News', newsSchema);

export default News;
