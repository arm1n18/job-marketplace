"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const contextClass = {
    success: "bg-[#F5F8FF] color-gray-600 text-common-blue border-[#1C64EE] border-opacity-30",
    error: "bg-red-600 ",
    info: "bg-gray-600",
    warning: "bg-[#FCD3D2] text-[#A84F4D] text-base font-semibold border-[#A84F4D] border-opacity-30",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <>
      {children}
      <ToastContainer
        toastClassName={(context) =>
            `${contextClass[context?.type || "default"]} relative flex p-1 min-h-10 rounded-md justify-between max-w-80 mx-auto
            overflow-hidden cursor-pointer border  `
          }          
        bodyClassName={() => "flex  p-3 "}
        position="top-center"
        autoClose={3000}
      />
    </>
  );
}