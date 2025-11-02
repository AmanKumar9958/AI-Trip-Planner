import React, { useState } from 'react';

const Avatar = ({ src, name = '', size = 40, className = '' }) => {
  const [error, setError] = useState(false);
  const initials = (name || '')
    .split(' ')
    .map((n) => n && n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const style = { width: size, height: size };

  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
      style={style}
      aria-label={name || 'User avatar'}
      title={name}
    >
      {!error && src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-gray-600">
          {initials || 'U'}
        </span>
      )}
    </div>
  );
};

export default Avatar;
