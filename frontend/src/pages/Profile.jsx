import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p className="mb-6">Username: {user.username}</p>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        Logout
      </button>
    </div>
  );
}
