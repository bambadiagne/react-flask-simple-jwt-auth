import axios from 'axios';
import decode from 'jwt-decode';
import { API_URL } from '../components/shared/constantes.env';

class AuthService {
  async register(signupData) {
    try {
      return await axios.post(`${API_URL}/signup`, signupData);
    } catch (error) {
      console.log('erreur signup', error);
      throw error;
    }
  }
  async login(signinData) {
    try {
      const result = await axios.post(`${API_URL}/auth`, signinData);
      if (result.data) {
        return result;
      }
      return result.response;
    } catch (error) {
      // const errorData=error.response.data;
      // if(errorData==='Invalid credentials'){
      //     return "Combinaison pseudo + mot de passe incorrecte";
      // };
      throw error;
    }
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token) {
    const decoded = decode(token);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', decoded.identity);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  }

  isLoggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
}
export default new AuthService();
