import React from "react";
import "./styles.css"; // Make sure to import your CSS file

const Home = () => {
  return (
    <div className="container mx-auto flex justify-center items-center h-[70vh] hover:pb-10 hover:scale-95 transition-all duration-500 ease-in-out">
      <div className="rounded-full w-[70vh] h-[70vh] flex justify-center items-center flex-col bg-radial-gradient shadow-2xl shadow-white  hover:pb-10 transition-all duration-300 ease-in-out">
      <span className="loading loading-dots text-orange-600 w-16"></span>
        <p className="text-4xl uppercase p-4 text-center text-white">Welcome to FlowTask</p>
        <p className="text-white font-bold text-center">Please login to continue</p>
      </div>
    </div>
  );
};

export default Home;
