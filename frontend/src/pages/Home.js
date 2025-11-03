import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to JobConnect
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Empowering youths and the unemployed to find jobs from the comfort of their homes.
          Employers can post vacancies and connect with talent instantly.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-blue-700 px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;