import express from "express";
import { check } from "express-validator";
import { 
  geocodeAddress, 
  reverseGeocodeCoordinates, 
  getDirections, 
  getPlaceAutocomplete, 
  getPlaceDetails 
} from '../controllers/locationController.js';
import { auth } from "../middleware/auth.js";

var router = express.Router();

// @route   POST /api/locations/geocode
// @desc    Geocode address to coordinates
// @access  Private
router.post(
  '/geocode',
  [
    auth,
    check('address', 'Address is required').not().isEmpty()
  ],
  geocodeAddress
);

// @route   POST /api/locations/reverse-geocode
// @desc    Reverse geocode coordinates to address
// @access  Private
router.post(
  '/reverse-geocode',
  [
    auth,
    check('latitude', 'Latitude is required').isDecimal(),
    check('longitude', 'Longitude is required').isDecimal()
  ],
  reverseGeocodeCoordinates
);

// @route   POST /api/locations/directions
// @desc    Get directions between two points
// @access  Private
router.post(
  '/directions',
  [
    auth,
    check('origin', 'Origin is required').not().isEmpty(),
    check('destination', 'Destination is required').not().isEmpty(),
    check('mode', 'Mode is optional but should be a valid transport mode').optional().isIn(['driving', 'walking', 'bicycling', 'transit'])
  ],
  getDirections
);

// @route   GET /api/locations/autocomplete
// @desc    Get place autocomplete suggestions
// @access  Private
router.get(
  '/autocomplete',
  [
    auth,
    check('input', 'Input is required').not().isEmpty()
  ],
  getPlaceAutocomplete
);

// @route   GET /api/locations/place/:placeId
// @desc    Get place details
// @access  Private
router.get(
  '/place/:placeId',
  [
    auth
  ],
  getPlaceDetails
);

export default router;
