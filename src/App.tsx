import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<{
    instructions?: string;
    encrypted_path?: string;
    level?: number | undefined;
  }>({});
  const [decryptedPath, setDecryptedPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAndSetData = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data:", data);
      setData(data);
      setDecryptedPath(""); // Reset decrypted path after new data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const decryptPath = (
    encryptedPath: string,
    level: number | undefined
  ): string => {
    if (level === 0) {
      // No decryption needed
      return encryptedPath;
    } else if (level === 1) {
      // Decrypt ASCII
      try {
        const asciiArray = JSON.parse(encryptedPath.replace("task_", ""));
        const decrypted = asciiArray
          .map((charCode: number) => String.fromCharCode(charCode))
          .join("");
        return `task_${decrypted}`;
      } catch (error) {
        console.error("Error decrypting ASCII path:", error);
        return "";
      }
    } else if (level === 2) {
      // Decrypt Hex
      try {
        return encryptedPath.replace(/[^0-9a-fA-F]/g, "");
      } catch (error) {
        console.error("Error decrypting Hex path:", error);
        return "";
      }
    }
    return "";
  };

  useEffect(() => {
    fetchAndSetData("/api/bazellMP@gmail.com");
  }, []);

  useEffect(() => {
    if (data.encrypted_path && data.level !== undefined) {
      const path = decryptPath(data.encrypted_path, data.level);
      setDecryptedPath(path);
    }
  }, [data]);

  const { instructions } = data;

  return (
    <>
      <h1>Pulley + React</h1>
      {instructions && (
        <>
          <pre
            style={{
              textAlign: "left",
              display: "flex",
              flexWrap: "wrap",
              maxWidth: "500px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              backgroundColor: "#333",
              border: "1px solid #ccc",
              padding: "2rem",
              marginBottom: "2rem",
              borderRadius: "5px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
      {loading && <p>Loading...</p>}

      {!loading && decryptedPath && (
        <div style={{ marginTop: "2rem" }}>
          <button
            type="button"
            onClick={() => fetchAndSetData(`/api/${decryptedPath}`)}
          >
            ⏳ Load next level...
          </button>
        </div>
      )}
    </>
  );
}

export default App;
