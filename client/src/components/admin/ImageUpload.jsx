import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

export const ImageUpload = ({ currentImage, onImageChange, className = '' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);

    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            onImageChange(file);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium">Store Icon</label>
            <div
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {preview ? (
                    <div className="relative w-full h-full p-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                            Drag and drop your image here, or click to select
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            PNG, JPG up to 2MB
                        </p>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />
        </div>
    );
};
