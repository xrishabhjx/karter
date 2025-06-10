const calculatePrice = (distance, duration, vehicleType, isPeakHour = false) => {
  // Base fare by vehicle type
  const baseFareByType = {
    'bike': 30,
    'auto': 50,
    'car': 80,
    'van': 120,
    'truck': 200
  };
  
  // Rate per km by vehicle type
  const ratePerKmByType = {
    'bike': 10,
    'auto': 15,
    'car': 20,
    'van': 25,
    'truck': 30
  };
  
  // Rate per minute by vehicle type
  const ratePerMinuteByType = {
    'bike': 1,
    'auto': 1.5,
    'car': 2,
    'van': 2.5,
    'truck': 3
  };
  
  // Default to bike if vehicle type not found
  const vehicleKey = vehicleType in baseFareByType ? vehicleType : 'bike';
  
  // Calculate base components
  const baseFare = baseFareByType[vehicleKey];
  const distanceFare = distance * ratePerKmByType[vehicleKey];
  const timeFare = duration * ratePerMinuteByType[vehicleKey];
  
  // Apply surge pricing if it's peak hour (1.5x)
  const surgeFactor = isPeakHour ? 1.5 : 1;
  const surgeFare = isPeakHour ? (baseFare + distanceFare + timeFare) * 0.5 : 0;
  
  // Calculate subtotal
  const subtotal = baseFare + distanceFare + timeFare + surgeFare;
  
  // Apply tax (18% GST)
  const tax = subtotal * 0.18;
  
  // Calculate total
  const total = subtotal + tax;
  
  return {
    baseFare,
    distanceFare,
    timeFare,
    surgeFare,
    tax,
    total: Math.round(total)
  };
};

export default calculatePrice;