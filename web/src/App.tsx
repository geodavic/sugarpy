import React, { useState } from 'react';
import './index.css';

const Spinner = () => (
  <div className="animate-spin border-t-2 border-b-2 border-black rounded-full w-5 h-5"></div>
);

const LanguageAnalyticsApp = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    mlu: { score: null, processedText: '', imageUrl: '', meetsCriteria: false, numerator: null, denominator: null },
    wps: { score: null, processedText: '', imageUrl: '', meetsCriteria: false, numerator: null, denominator: null },
    cps: { score: null, processedText: '', imageUrl: '', meetsCriteria: false, numerator: null, denominator: null },
    tnw: { score: null, processedText: '', imageUrl: '', meetsCriteria: false }
  });
  const [activeTab, setActiveTab] = useState('mlu');
  const [modalImage, setModalImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabsOpen, setTabsOpen] = useState(false);

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
          meetsCriteria: data.mlu.meets_criteria,
          numerator: data.mlu.numerator,
          denominator: data.mlu.denominator
        },
        wps: {
          score: data.wps.score,
          processedText: data.wps.processed_text,
          imageUrl: data.wps.img,
          meetsCriteria: data.wps.meets_criteria,
          numerator: data.wps.numerator,
          denominator: data.wps.denominator
        },
        cps: {
          score: data.cps.score,
          processedText: data.cps.processed_text,
          imageUrl: data.cps.img,
          meetsCriteria: data.cps.meets_criteria,
          numerator: data.cps.numerator,
          denominator: data.cps.denominator
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

  const hasResults = Object.values(results).some(result => result.score !== null);

  // Returns the formatted string based on the active metric
    const getFormattedString = (metric: string) => {
      const result = results[metric];
      if (!result) return '';
      const formattedScore = result.score === null ? 'N/A' : result.score.toFixed(2);
      if (metric === 'mlu') {
        return `Total number of morphmes / total utterances = ${result.numerator} / ${result.denominator} = ${formattedScore}`;
      }
      if (metric === 'wps') {
        return `Total number of words / total number of sentences = ${result.numerator} / ${result.denominator} = ${formattedScore}`;
      }
      if (metric === 'cps') {
        return `Total number of clauses / total number of sentences = ${result.numerator} / ${result.denominator} = ${formattedScore}`;
      }
      return '';
    };
  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Input Section */}
      <div className="w-full max-w-2xl mb-4">
        <textarea
          className="w-full h-60 p-4 rounded-md bg-white text-black"
          placeholder="Paste your sample here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleButtonClick}
            disabled={loading}
            className="flex items-center analytics-button white-bg"
          >
            {loading ? <Spinner /> : 'Calculate Metrics'}
          </button>
        </div>
      </div>

      {hasResults && (
        <>
          {/* Summary Table in Its Own Results Container */}
          <div className="results-container w-full max-w-2xl mt-6 p-4 text-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Metric</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Score</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Meets Criteria</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Image</th>
                </tr>
              </thead>
              <tbody>
                {['mlu', 'wps', 'cps', 'tnw'].map(metric => {
                  const result = results[metric];
                  return (
                    <tr key={metric}>
                      <td className="p-2 text-center">{metric.toUpperCase()}</td>
                      <td className="p-2 text-center">
                        {result.score !== null ? (metric === 'tnw' ? result.score : result.score.toFixed(2)) : 'N/A'}
                      </td>
                      <td className="p-2 text-center">
                        {result.score === null ? 'N/A' : (result.meetsCriteria ? 'Yes' : 'No')}
                      </td>
                        <td className="p-2 text-center">
                          {result.score === null || !result.imageUrl ? (
                            '-'
                          ) : (
                            <button
                              onClick={() => openModal(result.imageUrl)}
                              className="white-bg text-sm p-1"
                            >
                              View Image
                            </button>
                          )}
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clickable Div to Toggle Detailed Analysis */}
          <div
            className="results-container w-full max-w-2xl mt-4 p-2 text-white text-center cursor-pointer"
            onClick={() => setTabsOpen(!tabsOpen)}
          >
            {tabsOpen ? 'Hide Details' : 'Show Details'}
          </div>

          {/* Collapsible Detailed Processed Text with Tabs in Its Own Results Container */}
          {tabsOpen && (
            <div className="results-container w-full max-w-2xl mt-6 p-4 text-white">
              <nav role="tablist" aria-label="Metrics" className="flex w-full mb-4">
                {['mlu', 'wps', 'cps'].map(metric => {
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
                      className={`tab-button flex-1 aspect-square flex items-center justify-center rounded-none focus:outline-none ${isActive ? 'active' : ''}`}
                    >
                      {metric.toUpperCase()}
                    </button>
                  );
                })}
              </nav>
              <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
              >
                <div className="flex flex-col items-start space-y-2">
                  <hr className="w-full my-2 border-[#6A4952]" />
                  <div dangerouslySetInnerHTML={{ __html: results[activeTab].processedText }} />
                  {/* Horizontal line and bolded formatted string */}
                  <hr className="w-full my-2 border-[#6A4952]" />
                  <div className="font-bold">
                    {getFormattedString(activeTab)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-black white-bg">
              Close
            </button>
            <img src={modalImage} alt="Comparison to norms" className="rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageAnalyticsApp;

