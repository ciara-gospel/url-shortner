import { query } from '../config/db.js';

export const handleRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    // 1. Rechercher l'URL dans la base de données
    const result = await query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lien non trouvé' });
    }

    const urlData = result.rows[0];

    // 2. Vérifier l’expiration (si tu as une colonne d’expiration)
    if (urlData.expires_at && new Date(urlData.expires_at) < new Date()) {
      return res.status(410).json({ message: 'Lien expiré' });
    }

    // 3. Incrémenter le compteur de clics (assure-toi d’avoir une colonne "clicks" dans ta table)
    await query('UPDATE urls SET clicks = COALESCE(clicks, 0) + 1 WHERE short_code = $1', [shortCode]);

    // 4. Rediriger vers l’URL originale
    return res.redirect(302, urlData.original_url);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
