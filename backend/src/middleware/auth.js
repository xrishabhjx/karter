import passport from "passport";
import ErrorResponse from "../utils/errorResponse.js";

const auth = passport.authenticate('jwt', { session: false });

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }
    next();
  };
};


export { auth, authorize };