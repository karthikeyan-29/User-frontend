import { useState } from "react";
import { BASE_URL } from "./api";
import "./App.css";

function App() {
  // Search
  const [searchId, setSearchId] = useState("");
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add user
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [successMsg, setSuccessMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchId.trim()) {
      setError("Please enter user ID");
      return;
    }

    setLoading(true);
    setError("");
    setPerson(null);

    try {
      const response = await fetch(`${BASE_URL}/users/getUser?id=${searchId}`);

      if (!response.ok) {
        if (response.status === 404) throw new Error("User not found");
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setPerson(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");

      await response.json();
      setSuccessMsg("User added successfully!");
      setNewUser({ name: "", email: "", password: "" });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">User Management</h1>

      {/* 🔍 SEARCH USER */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="number"
          placeholder="Enter user ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {successMsg && <p className="success-text">{successMsg}</p>}

      {person && (
        <div className="card">
          <h2>{person.name}</h2>
          <p><strong>Email:</strong> {person.email}</p>
        </div>
      )}

      {/* ➕ ADD USER BUTTON */}
      <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "Add User"}
      </button>

      {/* ➕ ADD USER FORM */}
      {showAddForm && (
        <form className="add-form" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <button type="submit" className="search-button">
            Add User
          </button>
        </form>
      )}
    </div>
  );
}

export default App;