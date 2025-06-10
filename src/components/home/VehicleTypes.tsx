import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, Car, Truck, Package, MapPin, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

interface VehicleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  baseFare: number;
  perKm: number;
  capacity: {
    weight: string;
    dimensions?: string;
  };
  idealFor: string[];
  type: string;
  isPopular?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  icon,
  title,
  description,
  baseFare,
  perKm,
  capacity,
  idealFor,
  type,
  isPopular
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full relative overflow-hidden ${isPopular ? 'border-2 border-primary' : ''}`}>
        {isPopular && (
          <div className="absolute top-0 right-0 bg-primary text-secondary px-4 py-1 rounded-bl-lg font-semibold text-sm">
            Most Popular
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              {icon}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-secondary">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-secondary">₹{baseFare}</span>
              <span className="text-gray-600 ml-2">base fare</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>+ ₹{perKm}/km distance fare</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Package className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium text-secondary">Capacity</span>
              </div>
              <div className="ml-6 text-gray-600 space-y-1">
                <div>Weight: {capacity.weight}</div>
                {capacity.dimensions && (
                  <div>Dimensions: {capacity.dimensions}</div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium text-secondary">Best For</span>
              </div>
              <ul className="ml-6 text-gray-600 space-y-1">
                {idealFor.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link to={`/book?type=${type}`}>
            <Button variant={isPopular ? "secondary" : "outline"} fullWidth>
              Book Now
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

const VehicleTypes: React.FC = () => {
  const vehicles: VehicleCardProps[] = [
    {
      icon: <Bike className="h-8 w-8 text-secondary" />,
      title: "Two-Wheeler",
      description: "Fast delivery for small packages",
      baseFare: 49,
      perKm: 10,
      capacity: {
        weight: "Up to 5kg",
        dimensions: "45cm × 45cm × 45cm"
      },
      idealFor: [
        "Documents & Letters",
        "Food Delivery",
        "Small Electronics",
        "Urgent Deliveries"
      ],
      type: "bike"
    },
    {
      icon: <Car className="h-8 w-8 text-secondary" />,
      title: "Car/Auto",
      description: "Perfect for medium-sized packages",
      baseFare: 99,
      perKm: 15,
      capacity: {
        weight: "Up to 50kg",
        dimensions: "100cm × 80cm × 60cm"
      },
      idealFor: [
        "Multiple Packages",
        "Groceries & Shopping",
        "Medium Electronics",
        "Fragile Items"
      ],
      type: "car",
      isPopular: true
    },
    {
      icon: <Truck className="h-8 w-8 text-secondary" />,
      title: "Mini Truck",
      description: "Ideal for large shipments",
      baseFare: 199,
      perKm: 25,
      capacity: {
        weight: "Up to 500kg",
        dimensions: "200cm × 150cm × 150cm"
      },
      idealFor: [
        "Furniture & Appliances",
        "Office Relocations",
        "Bulk Orders",
        "Commercial Goods"
      ],
      type: "truck"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary">Choose Your Vehicle Type</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect vehicle for your delivery needs with our transparent pricing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <VehicleCard {...vehicle} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary/10 p-6 rounded-lg inline-block">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-secondary mb-1">Additional Information</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Peak hour surcharge may apply (8-10 AM & 5-7 PM)</li>
                  <li>• Waiting charges applicable after 10 minutes</li>
                  <li>• Prices inclusive of GST</li>
                  <li>• Cancellation charges may apply</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleTypes;