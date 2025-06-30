// File: src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/properties', {
        params: {
          title: searchTitle,
          location: searchLocation,
        },
      });
      setProperties(res.data.properties || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Properties</h1>

      {!localStorage.getItem('token') && (
        <div className="mb-4">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Login</Link>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</Link>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search Title"
          className="border p-2"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          placeholder="Search Location"
          className="border p-2"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={fetchProperties} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((prop) => (
          <div key={prop._id} className="border rounded p-4 shadow">
            <img src={prop.imageUrl} alt="" className="w-full h-40 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{prop.title}</h2>
            <p>{prop.location}</p>
            <p>₹{prop.price}</p>
            <p className="text-sm text-gray-500">Owner ID: {prop.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;