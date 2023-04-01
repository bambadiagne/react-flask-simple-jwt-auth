import logo from './logo.svg';
import './App.css';
import SignUp  from './components/auth/Signup';
import NotFound from './components/shared/NotFound';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route,Navigate, Routes} from "react-router-dom";
function App() {
  return <div className="App">
  <Router>
    <div>
      <Routes>
    
        <Route  path="/signup" element={<SignUp/>} />
        {/* <Route exact path={"/signin"} component={SignIn} /> */}
        {/* <Route exact path={"/profile"} component={() => <Profile />} /> */}
        <Route component={NotFound} />
        {/* <Route
        path="*"
        element={<Navigate to="/signin" replace co />}
    /> */}
      </Routes>
    </div>
  </Router>
</div>
}

export default App;
