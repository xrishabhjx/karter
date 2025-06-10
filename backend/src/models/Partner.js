import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  documents: {
    aadhaarCard: {
      number: {
        type: String,
        required: [true, 'Aadhaar number is required'],
        match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
      },
      frontImage: String,
      backImage: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    drivingLicense: {
      number: {
        type: String,
        required: [true, 'Driving license number is required']
      },
      frontImage: String,
      backImage: String,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    profilePhoto: String
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  availabilityStatus: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline'
  },
  rejectionRate: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'rejected'],
    default: 'pending'
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

// Create a 2dsphere index for geospatial queries
PartnerSchema.index({ 'currentLocation.coordinates': '2dsphere' });

const Partner = mongoose.model('Partner', PartnerSchema);
export default Partner;