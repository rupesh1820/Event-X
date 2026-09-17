import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";

const AdminAccounts = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const currentUser = JSON.parse(
    localStorage.getItem("eventxUser") || "null"
  );

  const token = localStorage.getItem("eventxToken");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/profile");
      return;
    }

    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Accounts fetch failed");
      }

      const userAndCreators = (data.users || []).filter(
        (account) =>
          account.role === "user" || account.role === "creator"
      );

      setAccounts(userAndCreators);
    } catch (error) {
      console.error("Fetch accounts error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this account?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(accountId);

      const response = await fetch(
        `${API_URL}/api/admin/users/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account delete failed");
      }

      setAccounts((previousAccounts) =>
        previousAccounts.filter(
          (account) => account._id !== accountId
        )
      );

      alert("Account deleted successfully.");
    } catch (error) {
      console.error("Delete account error:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAccounts =
    filter === "all"
      ? accounts
      : accounts.filter((account) => account.role === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        Loading accounts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Accounts</h1>
            <p className="mt-2 text-gray-400">
              View and delete registered users and creators.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back to Profile
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {["all", "user", "creator"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
                filter === role
                  ? "bg-violet-600 text-white"
                  : "border border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/10"
              }`}
            >
              {role === "all" ? "All Accounts" : `${role}s`}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-gray-400">
                <tr>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const isDeleting = deletingId === account._id;

                    return (
                      <tr
                        key={account._id}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-lg font-bold">
                              {account.fullName
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {account.fullName || "Unknown Account"}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: {account._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {account.emailAddress || "No email"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              account.role === "creator"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {account.role}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-gray-400">
                          {account.createdAt
                            ? new Date(
                                account.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          <button
                            disabled={isDeleting}
                            onClick={() => deleteAccount(account._id)}
                            className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
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

export default AdminAccounts;