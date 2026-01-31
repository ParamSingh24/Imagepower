import React, { useCallback, useState, useRef } from 'react';

const ImageUpload = ({ label, onImageSelect, image }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    }, [onImageSelect]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex flex-col gap-3 w-full animate-fade-in-up">
            <label className="text-sm font-medium text-white/70 ml-1">{label}</label>
            <div
                className={`relative group cursor-pointer transition-all duration-300 ease-out
          ${image ? 'h-48 border-accent-cyan/50' : 'h-32 border-white/10 hover:border-accent-purple/50'}
          border-2 border-dashed rounded-2xl overflow-hidden glass-panel
          ${dragActive ? 'scale-[1.02] border-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.3)]' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                />

                {image ? (
                    <div className="relative w-full h-full">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Uploaded"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-purple/20 transition-colors duration-300">
                            <svg className="w-8 h-8 text-white/50 group-hover:text-accent-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-white/80 font-medium">Click to upload or drag & drop</p>
                        <p className="text-white/40 text-xs mt-2">JPEG, PNG, WebP related</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
