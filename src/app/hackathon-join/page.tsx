"use client";

import { useState } from "react";
import {useSearchParams} from 'next/navigation';
interface HackathonApplicationFormProps {
  hackathonId: number;
}

export default function HackathonApplicationForm() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get("hackathonId");
  const [skills, setSkills] = useState<string[]>([]);
  const [coverNote, setCoverNote] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/hackathonds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // token will be read from cookies automatically on server
        },
        body: JSON.stringify({ hackathonId, skills, coverNote }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Application submitted successfully!");
        setSkills([]);
        setCoverNote("");
      } else {
        setMessage(`❌ ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-2xl space-y-4"
    >
      <h2 className="text-xl font-bold">Search for teammates</h2>

      {/* Skills input */}
      <div>
        <label className="block mb-1 font-medium">Skills you have</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Cover note */}
      <div>
        <label className="block mb-1 font-medium">Cover Note</label>
        <textarea
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          placeholder="Why should we select you?"
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {message && <p className="text-center mt-3">{message}</p>}
    </form>
  );
}

