// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "tu_clave_secreta"; // La misma clave que usaste para firmar el token

const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401); // No autorizado

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Prohibido
    req.user = user; // Almacena la información del usuario en la solicitud
    next();
  });
};

module.exports = authenticateToken;
