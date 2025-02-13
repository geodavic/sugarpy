import React, { useState } from 'react';
import './index.css';

const Spinner = () => (
  <div className="animate-spin border-t-2 border-b-2 border-black rounded-full w-5 h-5"></div>
);

const LanguageAnalyticsApp = () => {
  const [inputText, setInputText] = useState('');
  const [ageYears, setAgeYears] = useState(4);
  const [ageMonths, setAgeMonths] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    setErrorMessage(''); // Clear any previous error
    try {
      const response = await fetch(`http://0.0.0.0:5000/v2/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample: inputText, age_y: ageYears, age_m: ageMonths })
      });

      if (!response.ok) {
        let detailedError = '';
        try {
          const errorData = await response.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            detailedError = errorData.detail.map((err: any) => err.msg).join('\n');
          } else {
            detailedError = errorData.detail || errorData.message || JSON.stringify(errorData);
          }
        } catch (jsonErr) {
          detailedError = await response.text();
        }
        throw new Error(detailedError || response.statusText);
      }

      const data = await response.json();
      setResults({
        mlu: {
          score: data.mlu.score,
          processedText: data.mlu.processed_text,
          imageUrl: data.mlu.img,
          meetsCriteria: data.mlu.within_guidelines,
          numerator: data.mlu.numerator,
          denominator: data.mlu.denominator
        },
        wps: {
          score: data.wps.score,
          processedText: data.wps.processed_text,
          imageUrl: data.wps.img,
          meetsCriteria: data.wps.within_guidelines,
          numerator: data.wps.numerator,
          denominator: data.wps.denominator
        },
        cps: {
          score: data.cps.score,
          processedText: data.cps.processed_text,
          imageUrl: data.cps.img,
          meetsCriteria: data.cps.within_guidelines,
          numerator: data.cps.numerator,
          denominator: data.cps.denominator
        },
        tnw: {
          score: data.tnw.score,
          processedText: data.tnw.processed_text,
          imageUrl: data.tnw.img,
          meetsCriteria: data.tnw.within_guidelines
        }
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setErrorMessage(`${error.toString()}`);
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
      {/* Header Section */}
      <header className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-baseline">
          <h1 className="text-4xl font-bold text-white">Language Samples Calculator</h1>
          <span className="text-sm text-white">v0.4</span>
        </div>
        <div className="mt-2 flex justify-end space-x-4">
          <a href="" className="text-sm text-blue-300 hover:underline">Contact</a>
          <a href="" className="text-sm text-blue-300 hover:underline">Source code</a>
          <a href="" className="text-sm text-blue-300 hover:underline">languagesamples.com</a>
        </div>
      </header>

      {/* Input Section */}
      <div className="w-full max-w-2xl mb-4">
        <textarea
          className="w-full h-60 p-4 rounded-md bg-white text-black"
          placeholder="Paste your sample here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        {/* Dropdowns for Age and Calculate Metrics button */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <div className="flex items-center space-x-1">
            <label className="text-white" htmlFor="ageYears">Age (years):</label>
            <select
              id="ageYears"
              value={ageYears}
              onChange={(e) => setAgeYears(Number(e.target.value))}
              className="p-1 rounded white-bg text-black"
            >
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <label className="text-white" htmlFor="ageMonths">Age (months):</label>
            <select
              id="ageMonths"
              value={ageMonths}
              onChange={(e) => setAgeMonths(Number(e.target.value))}
              className="p-1 rounded white-bg text-black"
            >
              {[...Array(12).keys()].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
            <button
              onClick={handleButtonClick}
              disabled={loading}
              className="flex items-center analytics-button white-bg justify-center relative min-w-[150px] py-2"
            >
              {/* Reserve the space with the text, but hide it when loading */}
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Calculate Metrics
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </span>
              )}
            </button>
        </div>
        {/* Detailed Error Message */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mt-4">
            {errorMessage}
          </div>
        )}
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
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Within Guidelines</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Bell Curve</th>
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
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <div dangerouslySetInnerHTML={{ __html: modalImage }} className="rounded-lg" />
            <button
              onClick={closeModal}
              className="mt-4 text-black white-bg px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageAnalyticsApp;

