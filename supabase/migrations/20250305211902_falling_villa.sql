/*
  # Initial Schema Setup for Karter

  1. New Tables
    - `users` - Extended user profile data
      - `id` (uuid, primary key) - References auth.users
      - `name` (text) - User's full name
      - `email` (text) - User's email address
      - `phone` (text) - User's phone number
      - `role` (text) - User's role (user, partner, admin)
      - `profile_image` (text) - URL to profile image
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `partners` - Delivery partner information
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `verification_status` (text) - Partner verification status
      - `current_location` (geography) - Current location for tracking
      - `rating` (numeric) - Average rating
      - `total_deliveries` (integer) - Total completed deliveries
      - `availability_status` (text) - Online/offline status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vehicles` - Partner vehicles
      - `id` (uuid, primary key)
      - `partner_id` (uuid) - References partners.id
      - `type` (text) - Vehicle type (bike, car, van, etc.)
      - `model` (text) - Vehicle model
      - `registration_number` (text) - Vehicle registration
      - `is_verified` (boolean) - Verification status
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `deliveries` - Delivery records
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `partner_id` (uuid) - References partners.id
      - `vehicle_id` (uuid) - References vehicles.id
      - `status` (text) - Delivery status
      - `pickup_location` (geography) - Pickup coordinates
      - `dropoff_location` (geography) - Dropoff coordinates
      - `distance` (numeric) - Distance in kilometers
      - `price` (numeric) - Total price
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reviews` - Delivery reviews
      - `id` (uuid, primary key)
      - `delivery_id` (uuid) - References deliveries.id
      - `user_id` (uuid) - References users.id
      - `partner_id` (uuid) - References partners.id
      - `rating` (integer) - Rating score
      - `comment` (text) - Review comment
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
    - Ensure data privacy and security

  3. Indexes
    - Add indexes for frequently queried columns
    - Add spatial indexes for location columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'partner', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE availability_status AS ENUM ('online', 'offline', 'busy');
CREATE TYPE vehicle_type AS ENUM ('bike', 'auto', 'car', 'van', 'truck');
CREATE TYPE delivery_status AS ENUM (
  'pending',
  'searching',
  'accepted',
  'picked-up',
  'in-transit',
  'arriving',
  'delivered',
  'cancelled'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role user_role DEFAULT 'user',
  profile_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  verification_status verification_status DEFAULT 'pending',
  current_location geography(Point, 4326),
  rating numeric(3,2) DEFAULT 0,
  total_deliveries integer DEFAULT 0,
  availability_status availability_status DEFAULT 'offline',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  type vehicle_type NOT NULL,
  model text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  status delivery_status DEFAULT 'pending',
  pickup_location geography(Point, 4326) NOT NULL,
  dropoff_location geography(Point, 4326) NOT NULL,
  pickup_address text NOT NULL,
  dropoff_address text NOT NULL,
  distance numeric(10,2) NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id uuid REFERENCES deliveries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS partners_user_id_idx ON partners(user_id);
CREATE INDEX IF NOT EXISTS partners_location_idx ON partners USING GIST(current_location);
CREATE INDEX IF NOT EXISTS vehicles_partner_id_idx ON vehicles(partner_id);
CREATE INDEX IF NOT EXISTS deliveries_user_id_idx ON deliveries(user_id);
CREATE INDEX IF NOT EXISTS deliveries_partner_id_idx ON deliveries(partner_id);
CREATE INDEX IF NOT EXISTS deliveries_status_idx ON deliveries(status);
CREATE INDEX IF NOT EXISTS deliveries_pickup_idx ON deliveries USING GIST(pickup_location);
CREATE INDEX IF NOT EXISTS deliveries_dropoff_idx ON deliveries USING GIST(dropoff_location);
CREATE INDEX IF NOT EXISTS reviews_delivery_id_idx ON reviews(delivery_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Partners policies
CREATE POLICY "Partners can view their own profile"
  ON partners
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Partners can update their own profile"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Vehicles policies
CREATE POLICY "Partners can view their own vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = vehicles.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can manage their own vehicles"
  ON vehicles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = vehicles.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Deliveries policies
CREATE POLICY "Users can view their own deliveries"
  ON deliveries
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = deliveries.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deliveries"
  ON deliveries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their deliveries"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deliveries
      WHERE deliveries.id = reviews.delivery_id
      AND deliveries.user_id = auth.uid()
    )
  );

-- Create function to update user role when becoming a partner
CREATE OR REPLACE FUNCTION update_user_role_to_partner()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET role = 'partner'
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user role
CREATE TRIGGER partner_created
  AFTER INSERT
  ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_user_role_to_partner();

-- Create function to update partner rating
CREATE OR REPLACE FUNCTION update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partners
  SET rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM reviews
    WHERE partner_id = NEW.partner_id
  )
  WHERE id = NEW.partner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update partner rating
CREATE TRIGGER review_added
  AFTER INSERT OR UPDATE
  ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_rating();