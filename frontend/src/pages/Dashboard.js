// File: src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [myProperties, setMyProperties] = useState([]);

  const token = localStorage.getItem('token');

  const fetchMyProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProperties(res.data.filter(p => p.owner));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/properties', {
        title,
        description,
        location,
        price,
        imageUrl
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Property added successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setPrice('');
      setImageUrl('');
      fetchMyProperties();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add property. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchMyProperties();
    } catch (err) {
      console.error(err);
      alert('Failed to delete property');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleAddProperty} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Property
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Your Properties</h3>
        <ul className="space-y-4">
          {myProperties.map((prop) => (
            <li key={prop._id} className="border p-4 rounded shadow">
              <h4 className="font-bold">{prop.title}</h4>
              <p>{prop.location} — ₹{prop.price}</p>
              <p className="text-sm text-gray-600">{prop.description}</p>
              <img src={prop.imageUrl} alt="" className="w-full h-40 object-cover my-2" />
              <button
                onClick={() => handleDelete(prop._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
