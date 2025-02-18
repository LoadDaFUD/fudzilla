import { useState } from "react";
import WeaveDB from "weavedb-sdk";

export default function Home() {
  const [data, setData] = useState([]); // State to store fetched data
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [newName, setNewName] = useState(""); // State to store the new name for writing to the database

  // Initialize WeaveDB
  const initializeDB = async () => {
    const db = new WeaveDB({
      contractTxId: "lw6VLVDlormmUE-iTQRSabBuPn7U_DnSI1xknWfv3zI", // Replace with your actual contractTxId
    });
    await db.init();
    return db;
  };

  // Fetch data from the database
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const db = await initializeDB();
      const dbData = await db.get("Questions");

      if (Array.isArray(dbData) && dbData.length > 0) {
        setData(dbData);
      } else {
        setError("No data found or data is not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Write data to the database
  const writeData = async () => {
    if (!newName.trim()) {
      setError("Please enter a valid name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const db = await initializeDB();

      // Add a new document to the "Questions" collection
      await db.add({ name: newName }, "Questions");

      // Clear the input field
      setNewName("");

      // Fetch updated data after writing
      await fetchData();
    } catch (error) {
      console.error("Failed to write data:", error);
      setError("Failed to write data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WeaveDB Data</h1>

      {/* Form for writing data */}
      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter a name"
          disabled={loading}
        />
        <button onClick={writeData} disabled={loading}>
          {loading ? "Writing..." : "Add Name"}
        </button>
      </div>

      {/* Button to fetch data */}
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Refresh Data"}
      </button>

      {/* Display error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display fetched data */}
      {data.length > 0 && (
        <div>
          <h2>Names:</h2>
          {data.map((item, index) => (
            <p key={index}>
              Name {index + 1}: {item.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
