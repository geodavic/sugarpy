import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

type DetailedMetric = 'mlu' | 'wps' | 'cps';

interface MetricResultWithDetails {
  score: number | null;
  processedText: string;
  imageUrl: string;
  result: string;
  numerator: number | null;
  denominator: number | null;
}

interface TnwResult {
  score: number | null;
  processedText: string;
  imageUrl: string;
  result: string;
}

export interface MetricsResults {
  mlu: MetricResultWithDetails;
  wps: MetricResultWithDetails;
  cps: MetricResultWithDetails;
  tnw: TnwResult;
}

interface HomeProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  ageYears: number;
  setAgeYears: React.Dispatch<React.SetStateAction<number>>;
  ageMonths: number;
  setAgeMonths: React.Dispatch<React.SetStateAction<number>>;
}

const Spinner = () => (
  <div className="animate-spin border-t-2 border-b-2 border-black rounded-full w-5 h-5"></div>
);

const apiUrl = import.meta.env.VITE_SUGARPY_BASE_URL || 'http://0.0.0.0:5000';
const normalRange = "Within normal range"
const belowAverage = "Below average"
const delayed = "Delayed"

const LanguageAnalyticsApp = ({
  inputText,
  setInputText,
  ageYears,
  setAgeYears,
  ageMonths,
  setAgeMonths
}: HomeProps) => {
  // Local state for API call and UI (results, loading, errors, etc.)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState<MetricsResults>({
    mlu: { score: null, processedText: '', imageUrl: '', results: false, numerator: null, denominator: null },
    wps: { score: null, processedText: '', imageUrl: '', results: false, numerator: null, denominator: null },
    cps: { score: null, processedText: '', imageUrl: '', results: false, numerator: null, denominator: null },
    tnw: { score: null, processedText: '', imageUrl: '', results: false }
  });
  const [activeTab, setActiveTab] = useState<DetailedMetric>('mlu');
  const [modalImage, setModalImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabsOpen, setTabsOpen] = useState(false);
  const [exportTableLoading, setExportTableLoading] = useState(false);
  const [exportPlotsLoading, setExportPlotsLoading] = useState(false);

  // Calculate the number of utterances (non-empty lines)
  const utteranceCount = inputText.split('\n').filter(line => line.trim() !== '').length;

  const handleButtonClick = async () => {
    setLoading(true);
    setErrorMessage(''); // Clear any previous error

    try {
      const webMetricsResponse = await fetch(apiUrl + "/v2/web-metrics", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample: inputText, age: { years: ageYears, months: ageMonths }})
      });

      if (!webMetricsResponse.ok) {
        let detailedError = '';
        try {
          const errorData = await webMetricsResponse.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            detailedError = errorData.detail.map((err: any) => err.msg).join('\n');
          } else {
            detailedError = errorData.detail || errorData.message || JSON.stringify(errorData);
          }
        } catch (jsonErr) {
          detailedError = await webMetricsResponse.text();
        }
        throw new Error(detailedError || webMetricsResponse.statusText);
      }

      const webMetricsData = await webMetricsResponse.json();

      const metrics = ['mlu', 'wps', 'cps', 'tnw'];

      const normsResponses = await Promise.all(
        metrics.map(metric =>
          fetch(apiUrl + "/v2/norms", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ age: { years: ageYears, months: ageMonths }, metric })
          }).then(async response => {
            if (!response.ok) {
              throw new Error(`Error fetching norms for ${metric}`);
            }
            return response.json();
          })
        )
      );

      const assetsResponses = await Promise.all(
        metrics.map(metric =>
          fetch(apiUrl + "/v2/assets", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify({
              type: 'bell_curve',
              response_format: 'svg',
              age: { years: ageYears, months: ageMonths },
              scores: { [metric]: webMetricsData[metric].score }
            })
          }).then(async response => {
            if (!response.ok) {
              throw new Error(`Error fetching asset for ${metric}`);
            }
            return response.json();
          })
        )
      );

      setResults({
        mlu: {
          score: webMetricsData.mlu.score,
          processedText: webMetricsData.mlu.processed_text,
          imageUrl: assetsResponses[0].asset,
          results: webMetricsData.mlu.score > (normsResponses[0].mean_score - normsResponses[0].standard_deviation) ? normalRange : webMetricsData.mlu.score > (normsResponses[0].mean_score - 2 * normsResponses[0].standard_deviation) ? belowAverage : delayed,
          numerator: webMetricsData.mlu.numerator,
          denominator: webMetricsData.mlu.denominator
        },
        wps: {
          score: webMetricsData.wps.score,
          processedText: webMetricsData.wps.processed_text,
          imageUrl: assetsResponses[1].asset,
          results: webMetricsData.wps.score > (normsResponses[1].mean_score - normsResponses[1].standard_deviation) ? normalRange : webMetricsData.wps.score > (normsResponses[1].mean_score - 2 * normsResponses[1].standard_deviation) ? belowAverage : delayed,
          numerator: webMetricsData.wps.numerator,
          denominator: webMetricsData.wps.denominator
        },
        cps: {
          score: webMetricsData.cps.score,
          processedText: webMetricsData.cps.processed_text,
          imageUrl: assetsResponses[2].asset,
          results: webMetricsData.cps.score > (normsResponses[2].mean_score - normsResponses[2].standard_deviation) ? normalRange : webMetricsData.cps.score > (normsResponses[2].mean_score - 2 * normsResponses[2].standard_deviation) ? belowAverage : delayed,
          numerator: webMetricsData.cps.numerator,
          denominator: webMetricsData.cps.denominator
        },
        tnw: {
          score: webMetricsData.tnw.score,
          processedText: webMetricsData.tnw.processed_text,
          imageUrl: assetsResponses[3].asset,
          results: webMetricsData.tnw.score > (normsResponses[3].mean_score - normsResponses[3].standard_deviation) ? normalRange : webMetricsData.tnw.score > (normsResponses[3].mean_score - 2 * normsResponses[3].standard_deviation) ? belowAverage : delayed,
        }
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setErrorMessage(`${error.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTable = async () => {
    const availableResults = Object.values(results).some(result => result.score !== null);
    if (!availableResults) {
      alert("No results available to export.");
      return;
    }
    setExportTableLoading(true);
    try {
      const payload = {
        type: 'metric_table',
        response_format: 'png',
        age: { years: ageYears, months: ageMonths },
        scores: {
          tnw: results.tnw.score,
          cps: results.cps.score,
          wps: results.wps.score,
          mlu: results.mlu.score
        }
      };

      const response = await fetch(apiUrl + '/v2/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Error fetching metrics_table asset');
      }

      const data = await response.json();
      const dataUrl = `data:image/png;base64,${data.asset}`;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'metrics_table.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Error exporting table:", error);
      alert("Error exporting table: " + error.toString());
    } finally {
      setExportTableLoading(false);
    }
  };

  const handleExportPlots = async () => {
    const availableResults = Object.values(results).some(result => result.score !== null);
    if (!availableResults) {
      alert("No results available to export.");
      return;
    }
    setExportPlotsLoading(true);
    try {
      const payload = {
        type: 'bell_curve',
        response_format: 'png',
        age: { years: ageYears, months: ageMonths },
        scores: {
          tnw: results.tnw.score,
          cps: results.cps.score,
          wps: results.wps.score,
          mlu: results.mlu.score
        }
      };

      const response = await fetch(apiUrl + '/v2/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Error fetching bell_curve asset');
      }

      const data = await response.json();
      const dataUrl = `data:image/png;base64,${data.asset}`;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'bell_curve.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Error exporting plots:", error);
      alert("Error exporting plots: " + error.toString());
    } finally {
      setExportPlotsLoading(false);
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

  const getFormattedString = (metric: DetailedMetric) => {
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
          <Link to="/about" className="text-sm text-blue-300 hover:underline">About & Contact</Link>
          <Link to="/help" className="text-sm text-blue-300 hover:underline">Help</Link>
          <a 
            href="https://github.com/geodavic/sugarpy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-300 hover:underline"
          >
            Source code
          </a>
        </div>
      </header>

      {/* Input Section */}
      <div className="w-full max-w-2xl mb-4">
        <textarea
          className="w-full h-80 p-4 rounded-md bg-white text-black"
          placeholder="Paste your sample here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="w-full text-right text-md mt-1 text-white">
          {utteranceCount} utterance{utteranceCount === 1 ? '' : 's'}
        </div>
        <div className="flex justify-center items-center mt-4 space-x-4">
          <div className="flex items-center space-x-1">
            <label className="text-white" htmlFor="ageYears">Age (years):</label>
            <select
              id="ageYears"
              value={ageYears}
              onChange={(e) => setAgeYears(Number(e.target.value))}
              className="p-1 rounded white-bg text-black"
            >
              {[...Array(11-3).keys()].map((num) => (
                <option key={num + 3} value={num + 3}>{num + 3}</option>
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
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mt-4">
            {errorMessage}
          </div>
        )}
      </div>

      {hasResults && (
        <>
          {/* Summary Table */}
          <div className="results-container w-full max-w-2xl mt-6 p-4 text-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Metric</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Score</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Result</th>
                  <th className="border-b-2 border-[#6A4952] p-2 text-center">Bell Curve</th>
                </tr>
              </thead>
              <tbody>
                {(['mlu', 'wps', 'cps', 'tnw'] as (keyof MetricsResults)[]).map(metric => {
                  const result = results[metric];
                  return (
                    <tr key={metric}>
                      <td className="p-2 text-center">{metric.toUpperCase()}</td>
                      <td className="p-2 text-center">
                        {result.score !== null ? (metric === 'tnw' ? result.score : result.score.toFixed(2)) : 'N/A'}
                      </td>
                      <td className="p-2 text-center">
                        {result.score === null ? 'N/A' : result.results}
                      </td>
                      <td className="p-2 text-center">
                        {result.score === null || !result.imageUrl ? (
                          '-'
                        ) : (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openModal(result.imageUrl);
                            }}
                            className="text-sm text-blue-300 hover:underline"
                          >
                            View Image
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Export Buttons */}
          <div className="w-full max-w-2xl mt-4 flex justify-center space-x-4">
            <div
              onClick={() => { if (!exportTableLoading) handleExportTable(); }}
              className="results-container cursor-pointer p-2 text-white text-center relative"
              style={{ flex: 'none', width: 'calc(50% - 8px)' }}
            >
              <span className={exportTableLoading ? "opacity-0" : "opacity-100"}>
                Export table
              </span>
              {exportTableLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </span>
              )}
            </div>
            <div
              onClick={() => { if (!exportPlotsLoading) handleExportPlots(); }}
              className="results-container cursor-pointer p-2 text-white text-center relative"
              style={{ flex: 'none', width: 'calc(50% - 8px)' }}
            >
              <span className={exportPlotsLoading ? "opacity-0" : "opacity-100"}>
                Export plots
              </span>
              {exportPlotsLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </span>
              )}
            </div>
          </div>

          {/* Toggle Detailed Analysis */}
          <div
            className="results-container w-full max-w-2xl mt-4 p-2 text-white text-center cursor-pointer"
            onClick={() => setTabsOpen(!tabsOpen)}
          >
            {tabsOpen ? 'Hide Details' : 'Show Details'}
          </div>

          {/* Detailed Processed Text with Tabs */}
          {tabsOpen && (
            <div className="results-container w-full max-w-2xl mt-6 p-4 text-white">
              <nav role="tablist" aria-label="Metrics" className="flex w-full mb-4">
                {(['mlu', 'wps', 'cps'] as DetailedMetric[]).map(metric => {
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

