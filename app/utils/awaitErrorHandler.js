//middleware to hanlde errors 
export default callback => {
    return async (req, res, next) => {
      try {
        await callback(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };