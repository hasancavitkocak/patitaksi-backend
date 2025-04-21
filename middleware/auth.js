const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Yetkisiz erişim" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "gizliAnahtar123");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = authMiddleware;