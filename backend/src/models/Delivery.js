import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  trackingId: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['instant', 'scheduled', 'custom-bid', 'intercity'],
    default: 'instant'
  },
  status: {
    type: String,
    enum: ['pending', 'searching', 'accepted', 'picked-up', 'in-transit', 'arriving', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    contactName: String,
    contactPhone: String,
    instructions: String
  },
  dropLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    contactName: String,
    contactPhone: String,
    instructions: String
  },
  packageDetails: {
    description: String,
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    quantity: {
      type: Number,
      default: 1
    },
    isFragile: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['documents', 'food', 'groceries', 'electronics', 'clothing', 'furniture', 'other'],
      default: 'other'
    }
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car', 'van', 'truck'],
    required: true
  },
  scheduledTime: {
    pickupDate: Date,
    pickupTime: String,
    isFlexible: {
      type: Boolean,
      default: false
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    distancePrice: Number,
    waitingCharges: Number,
    taxes: Number,
    discount: Number,
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  distance: {
    value: Number, // in kilometers
    duration: Number // in minutes
  },
  route: {
    polyline: String,
    waypoints: [
      {
        location: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
          },
          coordinates: [Number]
        },
        timestamp: Date
      }
    ]
  },
  timeline: [
    {
      status: {
        type: String,
        enum: ['created', 'searching', 'accepted', 'picked-up', 'in-transit', 'arriving', 'delivered', 'cancelled']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      description: String,
      location: {
        coordinates: [Number],
        address: String
      }
    }
  ],
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'partner', 'admin', 'system']
    },
    timestamp: Date,
    refundStatus: {
      type: String,
      enum: ['not-applicable', 'pending', 'processed', 'failed'],
      default: 'not-applicable'
    }
  },
  customBid: {
    userProposedPrice: Number,
    bids: [
      {
        partner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Partner'
        },
        price: Number,
        estimatedPickupTime: Date,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    expiresAt: Date,
    status: {
      type: String,
      enum: ['open', 'accepted', 'expired', 'cancelled'],
      default: 'open'
    }
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

// Create indexes for geospatial queries
DeliverySchema.index({ 'pickupLocation.coordinates': '2dsphere' });
DeliverySchema.index({ 'dropLocation.coordinates': '2dsphere' });

// Generate tracking ID before saving
DeliverySchema.pre('save', async function(next) {
  if (!this.trackingId) {
    // Generate a unique tracking ID: KTR + random alphanumeric (8 chars)
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.trackingId = `KTR${randomPart}`;
  }
  
  // Add creation to timeline if it's a new document
  if (this.isNew) {
    this.timeline.push({
      status: 'created',
      timestamp: new Date(),
      description: 'Delivery request created'
    });
  }
  
  next();
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
export default Delivery;