import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

export const registerUser = async (req, res) => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // Si les données sont valides, continue le process d'enregistrement...
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };

  export const loginUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { email, password } = req.body;
  
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe invalide' });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
      logger.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  };


function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    logger.warn("No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded;

    if (!req.user?.id) {
      throw new Error("Invalid token payload");
    }

    logger.debug(`Token verified for user ${req.user.id}`);
    next();
  } catch (err) {
    logger.error("Token verification failed", err);
    return res.status(401).json({ message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
  }
}

export default authMiddleware;
