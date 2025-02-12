import React, { useState } from 'react';
import './index.css';

const Spinner = () => (
  <div className="animate-spin border-t-2 border-b-2 border-black rounded-full w-5 h-5"></div>
);

const LanguageAnalyticsApp = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    mlu: { score: null, processedText: '', imageUrl: '', meetsCriteria: false },
    wps: { score: null, processedText: '', imageUrl: '', meetsCriteria: false },
    cps: { score: null, processedText: '', imageUrl: '', meetsCriteria: false },
    tnw: { score: null, processedText: '', imageUrl: '', meetsCriteria: false }
  });
  const [activeTab, setActiveTab] = useState('mlu');
  const [modalImage, setModalImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://0.0.0.0:5000/v2/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample: inputText, age_y: 4, age_m: 0 })
      });
      const data = await response.json();
      setResults({
        mlu: {
          score: data.mlu.score,
          processedText: data.mlu.processed_text,
          imageUrl: data.mlu.img,
          meetsCriteria: data.mlu.meets_criteria
        },
        wps: {
          score: data.wps.score,
          processedText: data.wps.processed_text,
          imageUrl: data.wps.img,
          meetsCriteria: data.wps.meets_criteria
        },
        cps: {
          score: data.cps.score,
          processedText: data.cps.processed_text,
          imageUrl: data.cps.img,
          meetsCriteria: data.cps.meets_criteria
        },
        tnw: {
          score: data.tnw.score,
          processedText: data.tnw.processed_text,
          imageUrl: data.tnw.img,
          meetsCriteria: data.tnw.meets_criteria
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImage('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Input Section */}
      <div className="w-full max-w-2xl mb-4">
        <textarea
          className="w-full h-60 p-4 border border-black rounded-md bg-white text-black"
          placeholder="Paste your sample here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleButtonClick}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? <Spinner /> : 'Calculate All Analytics'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {Object.values(results).some(result => result.score !== null) && (
        <div className="w-full max-w-2xl mt-6 bg-[#42212a] p-4 rounded-md text-white">
          {/* Tab Navigation */}
          <nav role="tablist" aria-label="Metrics" className="flex w-full mb-4">
            {['mlu', 'wps', 'cps', 'tnw'].map(metric => {
              const isActive = activeTab === metric;
              return (
                <button
                  key={metric}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${metric}`}
                  id={`tab-${metric}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(metric)}
                  className={`flex-1 aspect-square border border-black flex items-center justify-center rounded-none focus:outline-none 
                    ${isActive 
                      ? '!bg-[#50C2B4] !text-white font-bold' 
                      : '!bg-[#2A9D8F] !text-white'}
                  `}
                >
                  {metric.toUpperCase()}
                </button>
              );
            })}
          </nav>

          {/* Tab Panel */}
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <div className="flex flex-col items-start space-y-2">
              <p>{activeTab.toUpperCase()} Score: {results[activeTab].score}</p>
              <p>Meets Criteria: {results[activeTab].meetsCriteria ? 'Yes' : 'No'}</p>
              <div dangerouslySetInnerHTML={{ __html: results[activeTab].processedText }} />
              {results[activeTab].imageUrl && (
                <button onClick={() => openModal(results[activeTab].imageUrl)} className="mt-2">
                  View Image
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-black">
              Close
            </button>
            <img src={modalImage} alt="Metric Illustration" className="rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageAnalyticsApp;

