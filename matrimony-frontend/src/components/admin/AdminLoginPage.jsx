import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin, verifyAdmin } from "../../api/service/adminServices";

const MatrimonyAdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    const saveAdmin = async () => {
      await registerAdmin();
    };
    saveAdmin();
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", loginData);
    const response = await verifyAdmin(loginData);
    console.log("response",response)
    if (response.status === 200) {
      localStorage.setItem("adminId", response?.data?.adminId);
      navigate("/admin/dashboard");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset for:", forgotEmail);
    // Add your password reset logic here
  };

  // jQuery equivalent functionality
  useEffect(() => {
    const handleLoginClick = () => {
      const log1 = document.querySelector(".log-1");
      const log2 = document.querySelector(".log-2");
      if (log1 && log2) {
        log1.style.display = "block";
        log2.style.display = "none";
      }
    };

    const handleForgotClick = () => {
      const log1 = document.querySelector(".log-1");
      const log2 = document.querySelector(".log-2");
      if (log1 && log2) {
        log2.style.display = "block";
        log1.style.display = "none";
      }
    };

    const ll1 = document.querySelector(".ll-1");
    const ll2 = document.querySelector(".ll-2");

    if (ll1) ll1.addEventListener("click", handleLoginClick);
    if (ll2) ll2.addEventListener("click", handleForgotClick);

    return () => {
      if (ll1) ll1.removeEventListener("click", handleLoginClick);
      if (ll2) ll2.removeEventListener("click", handleForgotClick);
    };
  }, []);

  return (
    <section>
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="inn">
              <div className="rhs">
                <div>
                  <div className="log-1">
                    <div className="form-tit">
                      <h4>Access admin-panel</h4>
                      <h1>Admin login</h1>
                      <p></p>
                    </div>
                    <div className="form-login">
                      <div>
                        <div className="form-group">
                          <label className="lb">Email:</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="lb">Password:</label>
                          <input
                            type="password"
                            className="form-control"
                            id="pwd"
                            placeholder="Enter password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleLoginSubmit}
                        >
                          Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="log-2">
                    <div className="form-tit">
                      <h4>Access admin-panel</h4>
                      <h1>Forgot password</h1>
                      <p></p>
                    </div>
                    <div className="form-login">
                      <div>
                        <div className="form-group">
                          <label className="lb">Email:</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            name="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleForgotSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="log-bot">
                    <ul>
                      <li>
                        <span className="ll-1">Login?</span>
                      </li>
                      <li>
                        <span className="ll-2">Forgot password?</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrimonyAdminLogin;
