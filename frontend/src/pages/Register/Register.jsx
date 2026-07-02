import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch("http://localhost:5000/register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),

      });

      const data = await response.json();

      if (response.ok) {

        alert("Registration Successful!");

        navigate("/login");

      } else {

        alert(data.message || data.error);

      }

    } catch (err) {

      console.log(err);

      alert("Server Error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-container">

      <div className="register-card">

        <h1>Create Account</h1>

        <p>Register to continue</p>

        <form onSubmit={handleRegister}>

          <div className="input-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />

          </div>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >

            {loading ? "Registering..." : "Register"}

          </button>

        </form>

        <div className="bottom-text">

          Already have an account?{" "}

          <Link to="/login">

            <span>Login</span>

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Register;