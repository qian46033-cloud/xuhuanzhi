import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  caption: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  caption,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={imageUrl}
          alt={caption}
          className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain border border-neutral-800 shadow-2xl"
        />

        {caption && (
          <p className="mt-3 text-xs font-mono text-neutral-400 tracking-wider text-center">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
