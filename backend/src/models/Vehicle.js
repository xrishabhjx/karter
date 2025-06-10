import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  type: {
    type: String,
    enum: ['bike', 'auto', 'car', 'van', 'truck'],
    required: [true, 'Vehicle type is required']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  registrationImage: String,
  insuranceNumber: String,
  insuranceExpiryDate: Date,
  insuranceImage: String,
  capacity: {
    weight: {
      type: Number, // in kg
      required: true
    },
    volume: Number // in cubic feet (optional)
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationNotes: String,
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

const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export default Vehicle;