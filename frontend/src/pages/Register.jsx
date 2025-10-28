import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        alert("Registration successful! Please login.");
        setFormData({ fullname: "", email: "", phoneNumber: "", password: "" });
        navigate('/')
        
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-red from-blue-100 via-purple-50 to-pink-50">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 cursor-pointer rounded-xl font-semibold hover:scale-105 transform transition-all shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6 relative z-10">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer hover:underline font-medium"
            
          >
            <Link to="/">Login</Link>
            
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
