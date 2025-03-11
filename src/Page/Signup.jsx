import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Signup Data:", data);
        alert("Signup Successful!");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg w-80">
                <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

                {/* Name */}
                <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
                />
                {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}

                {/* Email */}
                <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

                {/* Password */}
                <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

                {/* Confirm Password */}
                <input
                type="password"
                {...register("confirmPassword", { required: "Confirm password is required" })}
                placeholder="Confirm Password"
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}

                {/* Submit Button */}
                <div className="flex gap-4 w-full m-auto">
                    <button type="submit" className="w-fit px-2 py-2 m-auto bg-red-500 rounded mt-2">Signup</button>
                    <Link to={'/login'}>
                        <button type="submit" className="w-fit px-2 py-2 m-auto bg-red-500 rounded mt-2">Already Registered?</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
