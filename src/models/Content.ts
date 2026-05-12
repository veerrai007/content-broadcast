import mongoose from 'mongoose';

export type ContentType = {
  _id?: string;
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
  uploadedBy: mongoose.Schema.Types.ObjectId;
  status: string;
  rejectionReason?: string;
  startTime: Date;
  endTime: Date;
  rotationDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const contentSchema: mongoose.Schema<ContentType> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    rotationDuration: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model('Content', contentSchema);