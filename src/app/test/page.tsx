'use client';
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust if firebase.js is not in src/

export default function DebugJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const snapshot = await getDocs(collection(db, "stock_building_jobs"));
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchJobs();
  }, []);

  return (
    <div style={{padding: 32, fontFamily: "sans-serif"}}>
      <h2>Jobs from Firestore</h2>
      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Mold</th>
            <th>Team Lead</th>
            <th>SQM Target</th>
            <th>SQM Done</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.orderId}</td>
              <td>{job.mold}</td>
              <td>{job.teamLead}</td>
              <td>{job.sqmTarget}</td>
              <td>{job.sqmDone}</td>
              <td>{job.status}</td>
              <td>{job.remarks}</td>
            </tr>
          ))}
          {!jobs.length && (
            <tr>
              <td colSpan={7}>No jobs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
