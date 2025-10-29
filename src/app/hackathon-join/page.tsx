// src/app/hackathon-join/page.tsx
"use client";

import { useState, Suspense } from "react"; // Added Suspense
import { useSearchParams } from 'next/navigation';
import styles from './hackathon-join.module.css'; // Import CSS Module
import { cn } from "@/lib/utils"; // Import cn if needed later

// Inner component to access searchParams
function HackathonApplicationFormInner() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get("hackathonId");

  const [skills, setSkills] = useState<string[]>([]);
  const [coverNote, setCoverNote] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addSkill = () => {
    // Trim input and check if it's not empty and not already in the list
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput(""); // Clear input after adding
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic validation
    if (!hackathonId) {
        setMessage("❌ Hackathon ID is missing.");
        setLoading(false);
        return;
    }
    if (skills.length === 0) {
        setMessage("❌ Please add at least one skill.");
        setLoading(false);
        return;
    }

    try {
      // API endpoint might be /api/applications based on other files, or keep /api/hackathonds
      const res = await fetch("/api/hackathonds", { // Using original endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Token will be read from cookies automatically on server-side API route
        },
        // Ensure hackathonId is converted to number if required by API
        body: JSON.stringify({ hackathonId: Number(hackathonId), skills, coverNote }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Application submitted successfully!");
        // Clear form fields
        setSkills([]);
        setCoverNote("");
        setSkillInput("");
      } else {
        setMessage(`❌ ${data.error || "Something went wrong submitting the application"}`);
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setMessage("❌ Failed to submit application due to a network or server error.");
    } finally {
      setLoading(false);
    }
  };

  // Determine message class based on content
  const messageClass = message
    ? message.startsWith("✅")
      ? styles.successMessage
      : styles.errorMessage
    : '';

  return (
    <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.formTitle}>Apply to Join Team</h2>
            {/* Display Hackathon ID for context (optional) */}
            {hackathonId && <p className={styles.hackathonIdText}>Applying for Hackathon ID: {hackathonId}</p>}

            {/* Skills Input Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="skillInput" className={styles.label}>Your Skills</label>
                <div className={styles.skillAddContainer}>
                <input
                    id="skillInput"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., React)"
                    className={styles.skillInputField}
                    // Add skill on Enter key press
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className={styles.addButton}
                    disabled={!skillInput.trim()} // Disable if input is empty
                >
                    Add
                </button>
                </div>
                {/* Display Added Skills */}
                <div className={styles.skillsDisplayContainer}>
                {skills.length === 0 ? (
                    <p className={styles.noSkillsText}>No skills added yet.</p>
                ) : (
                    skills.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className={styles.removeSkillButton}
                            aria-label={`Remove ${skill}`}
                        >
                            &times; {/* HTML entity for 'x' */}
                        </button>
                        </span>
                    ))
                )}
                </div>
            </div>

            {/* Cover Note Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="coverNote" className={styles.label}>Cover Note (Why you?)</label>
                <textarea
                    id="coverNote"
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly explain why you'd be a good fit for the team..."
                    className={styles.textareaField}
                    rows={4}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || skills.length === 0} // Also disable if no skills added
                className={styles.submitButton}
            >
                {loading ? "Submitting..." : "Submit Application"}
            </button>

            {/* Feedback Message */}
            {message && <p className={`${styles.messageBase} ${messageClass}`}>{message}</p>}
        </form>
    </div>
  );
}

// Wrap the inner component with Suspense for useSearchParams
export default function HackathonApplicationForm() {
    return (
        <Suspense fallback={<div className={styles.loadingFallback}>Loading form...</div>}>
            <HackathonApplicationFormInner />
        </Suspense>
    );
}