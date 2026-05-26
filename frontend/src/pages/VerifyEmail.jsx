import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function VerifyEmail() {

  const [searchParams] = useSearchParams();

  const [message, setMessage] =
    useState("Verifying your email...");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {

    const token = searchParams.get("token");

    fetch(
      `http://localhost:8080/api/auth/verify?token=${token}`
    )
      .then(async (res) => {

        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage(data.msg);
        } else {
          setMessage(
            data.error || "Verification failed"
          );
        }
      })

      .catch(() => {
        setMessage("Something went wrong");
      });

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-3xl shadow-md text-center w-[400px]">

        <h1 className="text-2xl font-bold text-gray-900">
          {message}
        </h1>

        {success && (
          <Link
            to="/login"
            className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-2xl hover:opacity-90 transition"
          >
            Go To Login
          </Link>
        )}

      </div>
    </div>
  );
}