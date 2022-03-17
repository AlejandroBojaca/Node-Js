const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory');

exports.createReview = catchAsync(async function(req, res, next) {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      review: newReview
    }
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  next();
};

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
