import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {EyeIcon , EyeOffIcon} from 'lucide-react'

const Login = () => {
const [formData, setFormData] = useState({ email: "", password: "" });
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setLoading(true);

try {
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/login`,
    formData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  if (res.data.success) {
    alert("Login successful!");
    navigate("/dashboard");
  } else {
    setError(res.data.message || "Invalid credentials");
  }
} catch (err) {
  setError(err.response?.data?.message || "Request failed");
} finally {
  setLoading(false);
}


};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
{/* Floating gradient blobs */}
<div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
<div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>

  <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 transform hover:scale-[1.02] transition-transform duration-300">
    <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
      Login
    </h1>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-gray-600 font-medium">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
        />
      </div>

      <div className="relative">
        <label className="text-gray-600 font-medium">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm pr-10"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium bg-red-50 py-2 px-3 rounded-lg text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all shadow-lg"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="text-sm text-center text-gray-500 mt-6">
      Don’t have an account?{" "}
      <Link
        to="/register"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Register
      </Link>
    </p>
  </div>
</div>


);
};

export default Login;