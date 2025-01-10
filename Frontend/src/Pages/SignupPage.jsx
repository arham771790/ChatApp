import { useState } from "react";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({}); // State to store validation errors

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    // Email validation (simple regex check for valid email format)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (at least 6 characters)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors); // Update the errors state
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, proceed with the signup process
      signup(formData);
    }
  };

  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/****************************************************left side form *************/}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 ">
          <MessageSquare className="size-9 self-center bg-zinc-700 text-yellow-600 border-l-neutral-800 rounded-md" />
          <h1 className="from-neutral-200 text-3xl">Create Account</h1>
          <h1 className="text-yellow-400 text-opacity-80">Get Started with your free Account</h1>
          <form className="flex flex-col w-full p-6 rounded-lg mt-6" onSubmit={handleSubmit}>
            <h1 className="m-1 text-indigo-300">Full Name</h1>
            <input
              type="text"
              placeholder="John Doe"
              className="m-1 input input-bordered input-primary w-full max-w-xs"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <h1 className="m-1 text-indigo-300">Email</h1>
            <input
              type="text"
              placeholder="you@example.com"
              className="input input-bordered input-primary w-full max-w-xs"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <h1 className="m-1 text-indigo-300">Password</h1>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className="m-1 input input-bordered input-primary w-full max-w-xs pr-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <button className="btn btn-primary w-full max-w-xs m-1" type="submit">
              Sign Up
            </button>
            <div className="flex">
              <h1>Already have an account? </h1>{" "}
              <a href="/login" className="text-indigo-400 underline">
                Sign In
              </a>
            </div>
          </form>
        </div>

        {/******************************right side ************ */}
        <div className="flex justify-center items-center"></div>
      </div>
    </>
  );
};

export default SignupPage;
