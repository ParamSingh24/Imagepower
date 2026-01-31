import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import QuotaMeter from './components/QuotaMeter';
import { RevealWaveImage } from './components/ui/RevealWaveImage';

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      const res = await fetch('http://localhost:5000/quota');
      const data = await res.json();
      setEnergy(data.energy);
      setLimitReached(data.limit_reached);
    } catch (err) {
      console.error("Failed to fetch quota", err);
    }
  };

  const handleGenerate = async () => {
    if (!image1 || !image2) {
      setError("Please upload both images.");
      return;
    }
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    try {
      const res = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResultImage(data.image);
      fetchQuota(); // Update quota
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen p-4 flex flex-col items-center justify-center relative overflow-hidden text-white">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        <RevealWaveImage
          src="https://picsum.photos/1920/1080"
          waveSpeed={0.2}
          waveFrequency={0.7}
          waveAmplitude={0.5}
          revealRadius={0.5}
          revealSoftness={1}
          pixelSize={2}
          mouseRadius={0.4}
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <QuotaMeter energy={energy} limitReached={limitReached} />
        </div>

        <div className="w-full max-w-6xl flex flex-col items-center justify-center h-full">
          <header className="text-center mb-6 animate-fade-in-up flex-shrink-0 pointer-events-auto">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              <span className="text-white">AI Fashion</span> <span className="gradient-text">Editor</span>
            </h1>
            <p className="text-white/60 text-sm">Superimpose high-fashion items seamlessly.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch flex-grow max-h-[600px]">
            {/* Input Section */}
            <div className="md:col-span-1 space-y-4 flex flex-col justify-center">
              <div className="glass-panel p-4 rounded-2xl animate-fade-in-up flex-grow flex flex-col justify-center pointer-events-auto" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-semibold mb-3 text-white/90">Inputs</h2>
                <div className="space-y-4">
                  <ImageUpload
                    label="Person (Target)"
                    image={image1}
                    onImageSelect={setImage1}
                  />
                  <ImageUpload
                    label="Garment/Accessory"
                    image={image2}
                    onImageSelect={setImage2}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || limitReached || !image1 || !image2}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg flex-shrink-0 pointer-events-auto
                   ${loading || limitReached || !image1 || !image2
                    ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-accent-purple to-accent-cyan text-white hover:shadow-accent-cyan/20 hover:scale-[1.02] border border-white/20'
                  }
                 `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : limitReached ? 'Quota Exceeded' : 'Generate Look'}
              </button>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-xs text-center animate-fade-in flex-shrink-0 pointer-events-auto">
                  {error}
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="md:col-span-2 glass-panel p-2 rounded-3xl h-full flex items-center justify-center relative overflow-hidden animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.2s' }}>
              {resultImage ? (
                <div className="relative w-full h-full rounded-[20px] overflow-hidden group">
                  <img src={resultImage} alt="Result" className="w-full h-full object-contain bg-black/40" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={resultImage} download="fashion-edit.jpg" className="glass-btn px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:bg-white/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center animate-pulse-slow">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white/80 mb-2">Ready to Design</h3>
                  <p className="text-white/40 max-w-sm mx-auto text-sm">Upload your images on the left and unlock your daily AI creativity.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
