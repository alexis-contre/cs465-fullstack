const mongoose = require('mongoose');
require('../models/travlr');

const Trip = mongoose.model('trips');

// GET: /api/trips
// Return all available trips from MongoDB.
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();

    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: 'No trips found' });
    }

    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET: /api/trips/:tripCode
// Return one trip matching the requested trip code.
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.find({ code: req.params.tripCode }).exec();

    if (!trip || trip.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
};
