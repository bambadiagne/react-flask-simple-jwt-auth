import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import Spinner from "../shared/Spinner";
function SignUp() {
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [errors, setErrors] = useState({ errors: [] });
  const userData = {
    pseudo: null,
    email: null,
    password: null,
  };
  const [signupData, setSignupData] = useState(userData);
  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
  };
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  function validateuserData(signup) {
    const errorsForm = [];
    const { pseudo, email, password } = signup;

    if (!password) {
      errorsForm.push("Veuillez renseigner un mot de passe");
    }
    if (!validateEmail(email)) {
      errorsForm.push("Format email incorrect");
    }
    if (!pseudo) {
      errorsForm.push("le pseudo est obligatoire ");
    }
    setErrors({ ...errors, errors: errorsForm });
    return errorsForm.length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (validateuserData(signupData)) {
      AuthService.register(signupData)
        .then((res) => {
          if (res.data.status === "SUCCESSFUL") {
            setTimeout(() => {
              setLoading(false);
              setSuccessful(true);
              window.location = "/signin";
            }, 1500);
          } else {
            console.log("mess", res);
            setLoading(false);
            setErrors({ ...errors, errors: [res.data.message] });
          }
        })
        .catch((err) => {
          setLoading(false);
          setErrors({ ...errors, errors: [err.message] });
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container home">
      <div
        style={{ minHeight: "450px" }}
        className="shadow-lg border rounded my-5"
      >
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            {errors.errors.map((err) => (
              <span key={err} className="text-danger">
                {err}
              </span>
            ))}
          </div>
          <div
            hidden={!successful}
            className="alert alert-success"
            role="alert"
          >
            Compte créé avec succès !
          </div>
          <h2 className="mb-4">Inscription</h2>

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
                id="pseudo"
                className="rounded-0 col-6 rounded-right form-control"
                name="pseudo"
                placeholder="Pseudo"
              />
            </div>
          </div>
          <div className="row input-group ms-3  mb-2 justify-content-center">
            <div className="input-group-prepend col-auto px-0">
              <span className="rounded-0 h-100 input-group-text">
                <i className="text-primary fa fa-at"></i>
              </span>
            </div>
            <div className="ps-0 col-6">
              <input
                type="email"
                onChange={handleChange}
                id="email"
                className="p-2 form-control rounded-0"
                name="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="row input-group ms-3  mb-2 justify-content-center">
            <div className="input-group-prepend col-auto px-0">
              <span className="rounded-0 h-100 input-group-text">
              <i class="text-primary fa-sharp fa-solid fa-lock"></i>
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
            <button
              type="submit"
              className=" p-2 btn btn-primary btn-lg btn-block"
            >
              S'inscrire
              <i className="ms-2 fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
          <div className="text-center">
            Déjà un compte?<Link to={"/signin"}>Se connnecter </Link>{" "}
          </div>
        </form>
      </div>

      <Spinner loading={loading} />
    </div>
  );
}

export default SignUp;
