
"use client";
import { useState } from "react";

export default function HackathonForm() {
  const [formData, setFormData] = useState({
    hackathonName: "",
    hackathonDescription: "",
    problemStatement: "",
    teamSize: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/hackathon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({
          hackathonName: formData.hackathonName,
          hackathonDescription: formData.hackathonDescription,
          problemStatement: formData.problemStatement,
          teamSize: Number(formData.teamSize),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create hackathon");
      }

      setMessage(" Hackathon created successfully!");
      setFormData({
        hackathonName: "",
        hackathonDescription: "",
        problemStatement: "",
        teamSize: "",
      });
    } catch (err: any) {
      console.error("Hackathon creation failed:", err);
      setMessage(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Create Teams</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Hackathon Name</label>
        <input
          type="text"
          name="hackathonName"
          value={formData.hackathonName}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Your Idea</label>
        <textarea
          name="hackathonDescription"
          value={formData.hackathonDescription}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Problem Statement</label>
        <textarea
          name="problemStatement"
          value={formData.problemStatement}
          onChange={handleChange}
          required
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Team Size</label>
        <input
          type="number"
          name="teamSize"
          value={formData.teamSize}
          onChange={handleChange}
          required
          min="1"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Create Team"}
      </button>

      {message && (
        <p
          className={`mt-2 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

