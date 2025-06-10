import axios from 'axios';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Geocode address to coordinates
// @route   POST /api/locations/geocode
// @access  Private
export const geocodeAddress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.body;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return next(new ErrorResponse(`Geocoding failed: ${response.data.status}`, 400));
    }

    const result = response.data.results[0];
    const location = {
      address: result.formatted_address,
      coordinates: [
        result.geometry.location.lng,
        result.geometry.location.lat
      ],
      placeId: result.place_id,
      components: result.address_components
    };

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    logger.error(`Geocoding error: ${error.message}`);
    return next(new ErrorResponse('Error geocoding address', 500));
  }
});

// @desc    Reverse geocode coordinates to address
// @route   POST /api/locations/reverse-geocode
// @access  Private
export const reverseGeocodeCoordinates = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { latitude, longitude } = req.body;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return next(new ErrorResponse(`Reverse geocoding failed: ${response.data.status}`, 400));
    }

    const result = response.data.results[0];
    const location = {
      address: result.formatted_address,
      coordinates: [longitude, latitude],
      placeId: result.place_id,
      components: result.address_components
    };

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    logger.error(`Reverse geocoding error: ${error.message}`);
    return next(new ErrorResponse('Error reverse geocoding coordinates', 500));
  }
});

// @desc    Get directions between two points
// @route   POST /api/locations/directions
// @access  Private
export const getDirections = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination, mode = 'driving' } = req.body;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
        destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return next(new ErrorResponse(`Directions request failed: ${response.data.status}`, 400));
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    const directions = {
      distance: {
        text: leg.distance.text,
        value: leg.distance.value // in meters
      },
      duration: {
        text: leg.duration.text,
        value: leg.duration.value // in seconds
      },
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      startLocation: leg.start_location,
      endLocation: leg.end_location,
      steps: leg.steps.map(step => ({
        distance: step.distance,
        duration: step.duration,
        instructions: step.html_instructions,
        polyline: step.polyline,
        startLocation: step.start_location,
        endLocation: step.end_location,
        travelMode: step.travel_mode
      })),
      polyline: route.overview_polyline
    };

    res.status(200).json({
      success: true,
      directions
    });
  } catch (error) {
    logger.error(`Directions error: ${error.message}`);
    return next(new ErrorResponse('Error getting directions', 500));
  }
});

// @desc    Get place autocomplete suggestions
// @route   GET /api/locations/autocomplete
// @access  Private
export const getPlaceAutocomplete = asyncHandler(async (req, res, next) => {
  const { input, types = 'geocode', components = 'country:in' } = req.query;

  if (!input) {
    return next(new ErrorResponse('Input is required', 400));
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        types,
        components,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      return next(new ErrorResponse(`Place autocomplete failed: ${response.data.status}`, 400));
    }

    const predictions = response.data.predictions.map(prediction => ({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text,
      types: prediction.types
    }));

    res.status(200).json({
      success: true,
      predictions
    });
  } catch (error) {
    logger.error(`Place autocomplete error: ${error.message}`);
    return next(new ErrorResponse('Error getting place autocomplete suggestions', 500));
  }
});

// @desc    Get place details
// @route   GET /api/locations/place/:placeId
// @access  Private
export const getPlaceDetails = asyncHandler(async (req, res, next) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'address_component,formatted_address,geometry,name,place_id,type',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return next(new ErrorResponse(`Place details failed: ${response.data.status}`, 400));
    }

    const result = response.data.result;
    const place = {
      placeId: result.place_id,
      name: result.name,
      address: result.formatted_address,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      types: result.types,
      addressComponents: result.address_components
    };

    res.status(200).json({
      success: true,
      place
    });
  } catch (error) {
    logger.error(`Place details error: ${error.message}`);
    return next(new ErrorResponse('Error getting place details', 500));
  }
});