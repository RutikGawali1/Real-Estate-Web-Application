// File: frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const token = localStorage.getItem('token');

  const fetchProperties = async () => {
    const res = await axios.get('/api/properties', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProperties(res.data);
  };

  const addProperty = async () => {
    await axios.post('/api/properties', { title, description, location, price, imageUrl }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProperties();
  };

  const deleteProperty = async (id) => {
    await axios.delete(`/api/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProperties();
  };

  useEffect(() => { fetchProperties(); }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Image URL" onChange={(e) => setImageUrl(e.target.value)} />
      <button onClick={addProperty}>Add Property</button>

      {properties.map((prop) => (
        <div key={prop._id}>
          <h3>{prop.title} - {prop.location}</h3>
          <p>{prop.description} | ₹{prop.price}</p>
          <img src={prop.imageUrl} alt={prop.title} width="200" />
          <button onClick={() => deleteProperty(prop._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}