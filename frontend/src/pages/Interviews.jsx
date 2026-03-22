// src/pages/Interviews.jsx
import { useEffect, useState } from "react";
import { getEmployerInterviews } from "../services/api"; // ✅ backend endpoint

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getEmployerInterviews();
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to load interviews:", err);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Scheduled Interviews</h2>
      {interviews.length === 0 ? (
        <p>No interviews booked yet.</p>
      ) : (
        <ul className="space-y-2">
          {interviews.map((iv) => (
            <li key={iv._id} className="border p-3 rounded">
              <p><strong>Candidate:</strong> {iv.candidateName}</p>
              <p><strong>Job:</strong> {iv.jobTitle}</p>
              <p><strong>Date:</strong> {iv.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
