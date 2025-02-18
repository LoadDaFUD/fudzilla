import { useState } from "react";
import WeaveDB from "weavedb-sdk";

export default function Home() {
  const [data, setData] = useState([]); // State to store fetched data
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading state

  const start = async () => {
    setLoading(true); // Set loading to true when fetching starts
    setError(null); // Reset any previous errors

    try {
      // Initialize WeaveDB
      const db = new WeaveDB({
        contractTxId: "lw6VLVDlormmUE-iTQRSabBuPn7U_DnSI1xknWfv3zI", // Replace with your actual contractTxId
      });
      await db.init();

      // Fetch data from the database
      const dbData = await db.get("Questions");

      // Check if dbData is an array and has elements
      if (Array.isArray(dbData) && dbData.length > 0) {
        setData(dbData); // Update state with fetched data
      } else {
        setError("No data found or data is not in the expected format."); // Handle empty or invalid data
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load data. Please try again later."); // Handle errors
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WeaveDB Data</h1>
      <button onClick={start} disabled={loading}>
        {loading ? "Loading..." : "Get Data"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
