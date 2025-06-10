import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'cash', 'wallet'],
    required: true
  },
  gatewayPaymentId: String,
  gatewayOrderId: String,
  receiptUrl: String,
  description: String,
  metadata: {
    type: Map,
    of: String
  },
  refund: {
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    },
    transactionId: String,
    processedAt: Date
  },
  partnerPayout: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    },
    transactionId: String,
    processedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;