// File: src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadToCloudinary, getCloudinaryFile, deleteFromCloudinary } from '../cloudinary';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // For direct URL input
  const [useCloudinary, setUseCloudinary] = useState(true); // Toggle between file upload and URL
  const [message, setMessage] = useState('');
  const [myProperties, setMyProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({}); // Cache for resolved Cloudinary URLs

  const token = localStorage.getItem('token');

  const fetchMyProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/properties/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const properties = res.data.filter(p => p.owner);
      setMyProperties(properties);

      // Preload Cloudinary URLs
      const urlPromises = properties.map(async (prop) => {
        if (isCloudinaryPublicId(prop.imageUrl)) {
          try {
            const result = await getCloudinaryFile(prop.imageUrl);
            return { id: prop._id, url: result.secure_url };
          } catch (err) {
            console.warn(`Failed to get Cloudinary URL for ${prop.imageUrl}:`, err);
            return { id: prop._id, url: null };
          }
        }
        return { id: prop._id, url: prop.imageUrl };
      });

      const resolvedUrls = await Promise.all(urlPromises);
      const urlMap = {};
      resolvedUrls.forEach(({ id, url }) => {
        urlMap[id] = url;
      });
      setImageUrls(urlMap);
    } catch (err) {
      setMessage('Failed to load properties');
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setPrice('');
    setFile(null);
    setImageUrl('');
    document.getElementById('fileInput')?.value && (document.getElementById('fileInput').value = '');
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();

    if (useCloudinary && !file) {
      setMessage('Please select a file to upload');
      return;
    }

    if (!useCloudinary && !imageUrl.trim()) {
      setMessage('Please provide an image URL');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      let propertyData = {
        title,
        description,
        location,
        price
      };

      if (useCloudinary && file) {
        const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const result = await uploadToCloudinary(file, 'properties', uniqueId);
        propertyData.imageUrl = result.public_id;
        propertyData.isCloudinaryImage = true;
      } else if (!useCloudinary && imageUrl.trim()) {
        propertyData.imageUrl = imageUrl.trim();
        propertyData.isCloudinaryImage = false;
      }

      const res = await axios.post('http://localhost:5000/api/auth/properties', propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Property added successfully!');
      resetForm();
      fetchMyProperties(); // This will reload and resolve URLs
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add property. Please try again.';
      setMessage(errorMessage);
      console.error('Add property error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect if imageUrl is a Cloudinary public ID
  const isCloudinaryPublicId = (imageUrl) => {
    if (!imageUrl) return false;

    // Cloudinary public IDs typically:
    // 1. Don't start with http:// or https://
    // 2. May contain folder structure like "properties/1751374105256_gkkiksm6x"
    // 3. Don't have file extensions in the public ID
    const isUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

    if (isUrl) {
      return false; // It's a direct URL
    }

    // If it's not a URL and contains characters typical of Cloudinary public IDs
    // This is a reasonable assumption for your use case
    return true;
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/auth/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Check if it's a Cloudinary image before attempting to delete
      if (isCloudinaryPublicId(imageUrl) && imageUrl) {
        try {
          await deleteFromCloudinary(imageUrl);
        } catch (cloudinaryErr) {
          console.warn('Failed to delete from Cloudinary:', cloudinaryErr);
        }
      }

      setMessage('Property deleted successfully!');
      fetchMyProperties();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete property';
      setMessage(errorMessage);
    }
  };

  const handleImageError = (e, propertyTitle) => {
    console.warn(`Failed to load image for property: ${propertyTitle}`);
    e.target.style.display = 'none';
  };

  return (
    <React.Fragment>
      {/* Form Section */}
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-6"><i className="fas fa-plus-circle mr-2"></i>Add New Property</h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('successfully')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAddProperty} className="space-y-6">
          {/* First Row: Title, Price, Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1"
              required
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Second Row: Description and Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <textarea
                placeholder="Description"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Section */}
            <div className="border rounded p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Image Options</h4>

              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageOption"
                    checked={useCloudinary}
                    onChange={() => setUseCloudinary(true)}
                    className="mr-2"
                  />
                  Upload File (Cloudinary)
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageOption"
                    checked={!useCloudinary}
                    onChange={() => setUseCloudinary(false)}
                    className="mr-2"
                  />
                  Image URL
                </label>
              </div>

              {useCloudinary ? (
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <input
                  type="url"
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          {/* Add Property Button - Right aligned */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>

      {/* Properties List Section */}
      <div className="max-w-7xl mx-auto mt-8 p-6 border rounded shadow">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Properties ({myProperties.length})</h3>

          <input
            type="text"
            placeholder="Search by title or location..."
            className="w-full max-w-md p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {myProperties.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No properties found. Add your first property above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProperties
              .filter((prop) =>
                prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((prop) => (
                <div key={prop._id} className="border p-6 rounded-lg shadow hover:shadow-lg transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-xl text-gray-800">{prop.title}</h4>
                    {/* <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {isCloudinaryPublicId(prop.imageUrl) ? 'Cloudinary' : 'Direct URL'}
                    </span> */}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Location:</span> {prop.location}
                    </p>
                    <p className="text-green-600 font-bold text-lg mb-2">₹{Number(prop.price).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{prop.description}</p>
                  </div>

                  {prop.imageUrl && imageUrls[prop._id] && (
                    <div className="mb-4">
                      <img
                        src={imageUrls[prop._id]}
                        alt={prop.title}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => handleImageError(e, prop.title)}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {prop.imageUrl && !imageUrls[prop._id] && isCloudinaryPublicId(prop.imageUrl) && (
                    <div className="mb-4 h-48 bg-gray-200 rounded-lg border flex items-center justify-center">
                      <span className="text-gray-500">Loading image...</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(prop._id, prop.imageUrl)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-medium"
                  ><i className="fas fa-trash-alt mr-2"></i>
                    Delete Property
                  </button>
                </div>
              ))}
          </div>
        )}

        {searchTerm && myProperties.filter((prop) =>
          prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.location.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No properties match your search "{searchTerm}"
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

export default Dashboard;