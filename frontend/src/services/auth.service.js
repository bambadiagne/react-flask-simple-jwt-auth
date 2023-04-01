import axios from "axios";
import { API_URL } from "../components/shared/constantes.env";

class AuthService {
    
  async register(signupData) {
    try {
        return await axios.post(`${API_URL}/signup` ,signupData);
    } catch (error) {   
        console.log("erreur signup",error);
        return error;
    }
}
}
export default new AuthService();
