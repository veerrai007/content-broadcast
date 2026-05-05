// models/Content.js
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
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
      required: true, // stored URL after upload (e.g. Cloudinary)
    },
    fileType: {
      type: String,
      enum: ['jpg', 'jpeg', 'png', 'gif'],
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // teacher
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null, // only filled when status === 'rejected'
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
      type: Number, // in seconds
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model('Content', contentSchema);