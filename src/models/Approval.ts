import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // principal
      required: true,
    },
    action: {
      type: String,
      enum: ['approved', 'rejected'],
      required: true,
    },
    reason: {
      type: String,
      default: null, 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Approval || mongoose.model('Approval', approvalSchema);