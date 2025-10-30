// src/app/hackathon/page.tsx
"use client";
import { useState } from "react";
import styles from './hackathon.module.css'; // Import the CSS module

export default function HackathonForm() {
  const [formData, setFormData] = useState({
    hackathonName: "",
    teamName:"",
    hackathonDescription: "", // Corresponds to 'Your Idea'
    problemStatement: "",
    teamSize: "",
    // Add new state properties for UI development
    techStack: "",
    rolesNeeded: "",
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

    // Prepare data for API - *EXCLUDE* techStack and rolesNeeded
    const apiData = {
        hackathonName: formData.hackathonName,
        teamName:formData.teamName,
        hackathonDescription: formData.hackathonDescription,
        problemStatement: formData.problemStatement,
        teamSize: Number(formData.teamSize) || 0,
        rolesNeeded:formData.rolesNeeded.split(","),
        techStack:formData.techStack.split(",")
        // techStack and rolesNeeded are NOT included here
    };

    console.log("Form Data (including unsaved fields):", formData); // Log all form data
    console.log("Data being sent to API:", apiData); // Log only data sent to API

    try {
      const res = await fetch("/api/hackathon", { //
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
        },
        body: JSON.stringify(apiData), // Send only the data the API expects
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create hackathon team posting");
      }

      setMessage("✅ Hackathon team posting created successfully!"); // Updated message
      // Clear the form on success, including new fields
      setFormData({
        hackathonName: "",
        hackathonDescription: "",
        problemStatement: "",
        teamName:"",
        teamSize: "",
        techStack: "", // Clear techStack
        rolesNeeded: "", // Clear rolesNeeded
      });
    } catch (err: any) {
      console.error("Hackathon creation failed:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const messageClass = message
    ? message.startsWith("✅")
      ? styles.successMessage
      : styles.errorMessage
    : '';

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2 className={styles.formTitle}>Create Team Posting</h2>

        {/* Hackathon Name */}
        <div className={styles.inputGroup}>
          <label htmlFor="hackathonName" className={styles.label}>Hackathon Name</label>
          <input
            id="hackathonName"
            type="text"
            name="hackathonName"
            value={formData.hackathonName}
            onChange={handleChange}
            required
            className={styles.inputField}
            placeholder="e.g., Smart India Hackathon 2025"
          />
        </div>
        {/* Team Name */}
        <div className={styles.inputGroup}>
          <label htmlFor="teamName" className={styles.label}>Team Name</label>
          <input
            id="teamName"
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className={styles.inputField}
            placeholder="e.g., Akatsuki"
          />
        </div>

        {/* Your Idea */}
        <div className={styles.inputGroup}>
          <label htmlFor="hackathonDescription" className={styles.label}>Your Idea / Project Description</label>
          <textarea
            id="hackathonDescription"
            name="hackathonDescription"
            value={formData.hackathonDescription}
            onChange={handleChange}
            required
            rows={3}
            className={styles.textareaField}
            placeholder="Briefly describe the project you want to build"
          />
        </div>

        {/* Problem Statement */}
        <div className={styles.inputGroup}>
          <label htmlFor="problemStatement" className={styles.label}>Problem Statement (Optional)</label>
          <textarea
            id="problemStatement"
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            rows={2}
            className={styles.textareaField}
            placeholder="Specific problem statement if applicable"
          />
        </div>

        {/* Team Size */}
        <div className={styles.inputGroup}>
          <label htmlFor="teamSize" className={styles.label}>Required Team Size (including you)</label>
          <input
            id="teamSize"
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            required
            min="1"
            className={styles.inputField}
            placeholder="e.g., 4"
          />
        </div>

        {/* Tech Stack */}
        <div className={styles.inputGroup}>
          <label htmlFor="techStack" className={styles.label}>Proposed Tech Stack (comma-separated)</label>
          <input
            id="techStack"
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="e.g., React, Node.js, Python, AWS"
          />
        </div>

        {/* Roles Needed */}
        <div className={styles.inputGroup}>
          <label htmlFor="rolesNeeded" className={styles.label}>Roles Needed (comma-separated)</label>
          <input
            id="rolesNeeded"
            type="text"
            name="rolesNeeded"
            value={formData.rolesNeeded}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="e.g., Frontend Dev, Backend Dev, UI/UX Designer"
          />
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Creating..." : "Create Team Posting"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p className={`${styles.messageBase} ${messageClass}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}