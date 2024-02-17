// /utils/auth.js
import jwt_decode from 'jwt-decode';

export const getUserRoleFromToken = (token) => {
  try {
    const decoded = jwt_decode(token);
    return decoded.role; // Asume que el rol está en el payload del token
  } catch (error) {
    console.error('Error decodificando el token', error);
    return null;
  }
};
