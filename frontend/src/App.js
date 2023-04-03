import './App.css';
import SignUp from './components/auth/Signup';
import SignIn from './components/auth/Signin';
import ProtectedRoute from './components/auth/ProtectedRoute';

import NotFound from './components/shared/NotFound';

import Home from './components/shared/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route exact path="/signin" element={<SignIn />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
