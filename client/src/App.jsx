import { useState } from "react";
import { Loader } from "./components/Loader";

export default function App() {
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false)

  const generateHashtags = async () => {
    setLoading(true)
    if (!text.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setHashtags(data.hashtags || []);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching hashtags:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="card w-full max-w-md bg-white shadow-xl p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Hashtag Generator</h1>

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Enter your text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="btn btn-primary w-full mt-4 text-white"
          onClick={generateHashtags}
        >
          Generate Hashtags
        </button>
        {loading && <Loader />}

        {hashtags.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-800">Generated Hashtags:</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {hashtags.map((tag, index) => (
                <span key={index} className="badge badge-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
