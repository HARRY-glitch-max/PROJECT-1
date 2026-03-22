import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/applications').then((res) => setApps(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      {apps.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app._id} className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
              <p className="text-gray-600">Status: {app.status}</p>
              <p className="text-sm text-gray-500">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
