"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/globals.css";

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if data is already cached
  const loadCachedPhotos = () => {
    const cachedPhotos = localStorage.getItem("photos");
    if (cachedPhotos) {
      setPhotos(JSON.parse(cachedPhotos));
    }
  };

  const fetchPhotos = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.unsplash.com/photos", {
        params: {
          client_id:"V8SnZ4RY7DknZE6uxg7vEIVgBQI91B67x-v_d_QoFZM", // Use env variables for security
          page: pageNum,
          per_page: 12,
        },
      });
      const newPhotos = response.data;
      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos, ...newPhotos];
        // Cache the photos in localStorage
        localStorage.setItem("photos", JSON.stringify(updatedPhotos));
        return updatedPhotos;
      });
    } catch (err) {
      setError("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCachedPhotos(); // Load cached photos if available
    fetchPhotos(page); // Fetch new photos
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10 // Triggering when near the bottom
    ) {
      if (!loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  return (
    <div className="container">
      <h1 className="header">Photo Gallery</h1>
      <div className="gallery">
        {photos.map((photo, index) => (
          <div className="photo" key={`${photo.id}-${index}`} role="listitem">
            {" "}
            {/* Use unique key and ARIA role */}
            <img
              src={photo.urls.small}
              alt={photo.alt_description || "Unsplash Photo"} // Alt description for accessibility
              className="photo-img"
              loading="lazy" // Lazy load the images
            />
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Home;
