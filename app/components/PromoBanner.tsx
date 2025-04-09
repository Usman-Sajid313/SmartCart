"use client";

import React, { useEffect, useState } from 'react';

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-500 text-white p-4 flex flex-col items-center md:flex-row md:justify-center">
      <p className="text-lg font-semibold mr-4 mb-1 md:mb-0">
        GET 20% OFF ON THE NEW iPhone
      </p>
      <div className="flex space-x-2 text-xl font-bold">
        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span>:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default PromoBanner;
