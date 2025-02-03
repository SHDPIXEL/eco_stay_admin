import React from "react";

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 poppins-regular">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="text-gray-500">&copy; Copyright {currentYear}. All rights reserved.</div>
            <div className="text-gray-500">Developed By <a 
            href="https://www.metamatrixtech.com/"
            target="_blank"
            className="text-blue-400"
            >Metamatrix</a> | <a 
            href="https://shdpixel.com/"
            target="_blank"
            className="text-blue-400"
            >SHDPIXEL</a></div>
          </div>
    </footer>
  );
};

export default Footer;
