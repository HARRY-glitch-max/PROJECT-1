import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-6 border-t">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} JobConnect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
