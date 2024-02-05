import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Access denied. Invalid token format." });
  }

  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("request by:", req.user);

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
