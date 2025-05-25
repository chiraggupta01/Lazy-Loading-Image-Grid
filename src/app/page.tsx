 "use client"

import React, { useEffect, useRef, useState } from 'react';
import './ImageGrid.css';

interface ImageData {
  id: string;
  author: string;
  download_url: string;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState<number>(1);
  const loader = useRef<HTMLDivElement | null>(null);

  // Fetch images
  const fetchImages = async () => {
    try {
      const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=9`);
      const data: ImageData[] = await res.json();
      setImages((prev) => [...prev, ...data]);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  return (
    <>
      <div className="grid">
        {images.map((img) => (
          <div className="image-card" key={img.id}>
            <img
              src={`https://picsum.photos/id/${img.id}/400/300`}
              alt={img.author}
              loading="lazy"
              className="image"
            />
          </div>
        ))}
      </div>
      <div ref={loader} style={{ height: '100px' }} />
    </>
  );
};

export default Home;
