import React from "react";
export default function VerifySuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">
          Email Verified Successfully
        </h1>

        <p className="mt-3 text-gray-600">
          You can now login to your account.
        </p>
      </div>
    </div>
  );
}