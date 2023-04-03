import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Spinner from '../shared/Spinner';
function SignIn() {
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [errors, setErrors] = useState({ errors: [] });
  const userData = {
    username: null,
    password: null
  };
  let navigate = useNavigate();

  const [signinData, setSigninData] = useState(userData);
  const handleChange = (e) => {
    setSigninData({ ...signinData, [e.target.id]: e.target.value });
  };
  function validateuserData(signin) {
    const errorsForm = [];
    const { username, password } = signin;

    if (!password) {
      errorsForm.push('Veuillez renseigner un mot de passe');
    }
    if (!username) {
      errorsForm.push('le pseudo est obligatoire ');
    }
    setErrors({ ...errors, errors: errorsForm });
    return errorsForm.length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (validateuserData(signinData)) {
      AuthService.login(signinData)
        .then((res) => {
          if (res.data.access_token) {
            setSuccessful(true);

            setTimeout(() => {
              setLoading(false);
              AuthService.setToken(res.data.access_token);
              navigate('/', { replace: true });
            }, 1500);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.message) {
            setErrors({ ...errors, errors: [err.message] });
          }
          if (err.response.data) {
            setErrors({ ...errors, errors: [err.response.data.description] });
          }
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container home">
      <div style={{ minHeight: '450px' }} className="shadow-lg border rounded my-5">
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            {errors.errors.map((err) => (
              <span key={err} className="text-danger">
                {err}
              </span>
            ))}
          </div>
          <div hidden={!successful} className="w-50 mx-auto alert alert-success" role="alert">
            Connexion reussie !
          </div>
          <h2 className="mb-4">Connexion</h2>

          <div className="row input-group ms-3  mb-2 justify-content-center">
            <div className="input-group-prepend col-auto px-0">
              <span className="rounded-0 h-100 input-group-text">
                <i className="text-primary fa fa-user"></i>
              </span>
            </div>
            <div className="ps-0 col-6 col-xs-12">
              <input
                onChange={handleChange}
                type="text"
                id="username"
                className="rounded-0 col-6 rounded-right form-control"
                name="username"
                placeholder="Pseudo"
              />
            </div>
          </div>
          <div className="row input-group ms-3  my-4 justify-content-center">
            <div className="input-group-prepend col-auto px-0">
              <span className="rounded-0 h-100 input-group-text">
                <i className="text-primary fa-sharp fa-solid fa-lock"></i>
              </span>
            </div>
            <div className="ps-0 col-6">
              <input
                type="password"
                onChange={handleChange}
                id="password"
                className="form-control rounded-0"
                name="password"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="ms-3 my-4 ">
            <button type="submit" className=" p-2 btn btn-primary btn-lg btn-block">
              Se connecter
            </button>
          </div>
          <div className="text-center">
            Déjà un compte?<Link to={'/signin'}>Se connnecter </Link>{' '}
          </div>
        </form>
      </div>

      <Spinner loading={loading} />
    </div>
  );
}

export default SignIn;
