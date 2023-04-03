import { useEffect } from 'react';
import AuthService from '../../services/auth.service';
import { useNavigate} from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  let navigate = useNavigate();
  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate('/signin');
    }
  }, []);

  return children;
};

export default ProtectedRoute;
