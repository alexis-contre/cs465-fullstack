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

const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    });

    return res.status(201).json(newTrip);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTrip) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const tripsDeleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      code: req.params.tripCode,
    });

    if (!deletedTrip) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip,
};
