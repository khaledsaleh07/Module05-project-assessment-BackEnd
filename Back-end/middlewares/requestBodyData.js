const logReuestBodyData = async (req, res, next) => {
  try {
    if (req.method === "POST" || req.method === "PUT") {
      console.log(req.method, req.path, "req.body:", req.body);
    } else {
      console.log(req.method, req.path);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default logReuestBodyData;
