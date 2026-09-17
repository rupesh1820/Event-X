import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("eventxUser") || "null"
  );

  const token = localStorage.getItem("eventxToken");

  const fetchUsers = useCallback(async () => {
    try {
      if (!token) {
        throw new Error("Token nahi mila. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {
            message: `API route not found. Status: ${response.status}`,
          };

      if (response.status === 401) {
        localStorage.removeItem("eventxToken");
        localStorage.removeItem("eventxUser");

        alert(data.message || "Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert(data.message || "Admin access required.");
        navigate("/profile");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Users fetch failed");
      }

      const onlyUsers = (data.users || []).filter(
        (user) => user.role === "user"
      );

      setUsers(onlyUsers);
    } catch (error) {
      console.error("Fetch users error:", error);
      alert(error.message || "Something went wrong while fetching users.");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/profile");
      return;
    }

    fetchUsers();
  }, [currentUser, fetchUsers, navigate]);

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      if (!token) {
        throw new Error("Token nahi mila. Please login again.");
      }

      setUpdatingId(userId);

      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {
            message: `API route not found. Status: ${response.status}`,
          };

      if (response.status === 401) {
        localStorage.removeItem("eventxToken");
        localStorage.removeItem("eventxUser");

        alert(data.message || "Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert(data.message || "Admin access required.");
        navigate("/profile");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "User delete failed");
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId)
      );

      alert(data.message || "User deleted successfully.");
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.message || "Something went wrong while deleting user.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>

            <p className="mt-2 text-gray-400">
              View and manage registered users.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back to Profile
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-gray-400">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isUpdating = updatingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-lg font-bold">
                              {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {user.fullName || "Unknown User"}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: {user._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {user.emailAddress || "No email"}
                        </td>

                        <td className="px-6 py-5 text-gray-400">
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          <button
                            disabled={isUpdating}
                            onClick={() => deleteUser(user._id)}
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {isUpdating ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;