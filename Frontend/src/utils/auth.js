/**
 * Vérifie si l'utilisateur est authentifié.
 * @returns {boolean} - Retourne true si le token existe et est valide, sinon false.
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');

    if (!token) return false;

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1])); // Décodage du payload du JWT
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        return exp > now; // Vérifie si le token n'est pas expiré
    } catch (err) {
        console.error('Invalid token:', err.message);
        return false;
    }
};

/**
 * Décodage du token JWT pour extraire les informations utilisateur.
 * @returns {object | null} - Les données décodées du token ou null si le token est invalide.
 */
export const decodeToken = () => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du payload du JWT
        return payload;
    } catch (err) {
        console.error('Invalid token:', err.message);
        return null;
    }
};
