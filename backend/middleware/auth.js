const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No token, authorization denied" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = auth;
