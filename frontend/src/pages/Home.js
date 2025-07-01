import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCloudinaryFile } from '../cloudinary'; // Import your cloudinary helper

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [imageUrls, setImageUrls] = useState({}); // Cache for resolved Cloudinary URLs
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Helper function to detect if imageUrl is a Cloudinary public ID (same as Dashboard)
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
    return true;
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/properties', {
        params: {
          title: searchTitle,
          location: searchLocation,
        },
      });
      
      const propertiesData = res.data.properties || res.data;
      setProperties(propertiesData);
      setCurrentPage(1); // Reset to first page when fetching new data

      // Preload Cloudinary URLs (same logic as Dashboard)
      const urlPromises = propertiesData.map(async (prop) => {
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
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleImageError = (e, propertyTitle) => {
    console.warn(`Failed to load image for property: ${propertyTitle}`);
    e.target.src = 'https://via.placeholder.com/400x240?text=No+Image';
  };

  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    console.log('Previous clicked, current page:', currentPage);
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      console.log('Moving to page:', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    console.log('Next clicked, current page:', currentPage, 'total pages:', totalPages);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      console.log('Moving to page:', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > 5) {
          pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        if (totalPages > 5) {
          pageNumbers.push('...');
        }
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <span className="text-gray-600">Total: {properties.length} properties</span>
      </div>

      {!localStorage.getItem('token') && (
        <div className="mb-4">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Login</Link>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">SignUp</Link>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search Title"
          className="border p-2 rounded"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          placeholder="Search Location"
          className="border p-2 rounded"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={fetchProperties} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {currentProperties.map((prop) => (
          <div key={prop._id} className="border rounded p-4 shadow hover:shadow-lg transition-shadow">
            {/* Image handling - same logic as Dashboard */}
            {prop.imageUrl && imageUrls[prop._id] && (
              <img 
                src={imageUrls[prop._id]} 
                alt={prop.title || 'Property'} 
                className="w-full h-40 object-cover mb-2 rounded"
                onError={(e) => handleImageError(e, prop.title)}
                loading="lazy"
              />
            )}

            {/* Loading state for Cloudinary images */}
            {prop.imageUrl && !imageUrls[prop._id] && isCloudinaryPublicId(prop.imageUrl) && (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded">
                <span className="text-gray-500">Loading image...</span>
              </div>
            )}

            {/* No image available */}
            {!prop.imageUrl && (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-2">{prop.title}</h2>
            <p className="text-gray-600 mb-1">📍 {prop.location}</p>
            <p className="text-green-600 font-bold text-lg mb-2">₹{Number(prop.price).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Owner ID: {prop.owner}</p>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No properties found.</p>
        </div>
      )}

      {/* Pagination */}
      {properties.length > 0 && (
        <div className="flex flex-col items-center mt-8">
          {/* Pagination Controls */}
          <div className="flex items-center gap-2 mb-4">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>←</span>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {getPageNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() => number !== '...' && paginate(number)}
                  className={`px-3 py-2 rounded-md min-w-[40px] ${
                    number === currentPage
                      ? 'bg-blue-600 text-white'
                      : number === '...'
                      ? 'bg-white text-gray-400 cursor-default'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={number === '...'}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
              <span>→</span>
            </button>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, properties.length)} of {properties.length} entries
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;