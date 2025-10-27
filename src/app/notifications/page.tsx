"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // if using shadcn
import axios from "axios";

interface Applicant {
  id: number;
  applicant: {
    name: string;
    email: string;
  };
  applicantSkills: string[]; // ✅ include skills
  status: string;
  hackathon: {
    hackathonName: string;
  };
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/status"); // your GET route
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    try {
      console.log(status)
      await axios.put(`/api/applications/${id}`, { status });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-8">Loading applicants...</p>;

  if (applications.length === 0)
    return <p className="text-center text-gray-500 mt-8">No applicants found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Applicants</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border"
          >
            <div>
              <p className="font-medium text-lg">{app.applicant.name}</p>
              <p className="text-sm text-gray-500">{app.applicant.email}</p>
              <p className="text-sm text-gray-400 mb-2">
                Hackathon: {app.hackathon.hackathonName}
              </p>

              {/* ✅ Display Skills */}
              {app.applicantSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {app.applicantSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No skills provided
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {app.status === "pending" ? (
                <>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => updateStatus(app.id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => updateStatus(app.id, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
