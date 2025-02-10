import React, { useState } from 'react';
import './index.css';

const Spinner = () => <div className="animate-spin border-t-2 border-b-2 border-gray-500 rounded-full w-5 h-5"></div>;

const LanguageAnalyticsApp = () => {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState({ mlu: false, wps: false, cps: false, all: false });
    const [results, setResults] = useState({ mlu: null, wps: null, cps: null, processedText: '', imageUrl: '' });

    const handleButtonClick = async (metric) => {
        setLoading((prev) => ({ ...prev, [metric]: true }));
        try {
            const response = await fetch(`http://0.0.0.0:5000/v2/metrics`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sample: inputText, age_y: 4, age_m: 0 })
            });
            const data = await response.json();
            setResults((prev) => ({ 
                ...prev, 
                [metric]: data[metric].score, 
                processedText: data[metric].processed_text, 
                imageUrl: data[metric].img
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading((prev) => ({ ...prev, [metric]: false }));
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <div className="w-full max-w-2xl mb-4">
                <textarea 
                    className="w-full h-40 p-4 border border-gray-300 rounded-md"
                    placeholder="Paste your sample here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex justify-between mt-4 space-x-4">
                    {['mlu', 'wps', 'cps', 'all'].map((metric) => (
                        <button 
                            key={metric}
                            onClick={() => handleButtonClick(metric)}
                            disabled={loading[metric]}
                        >
                            {loading[metric] ? <Spinner /> : `Calculate ${metric.toUpperCase()}`}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-2xl flex">
                <div className="flex-grow">
                    {results.mlu !== null || results.wps !== null || results.cps !== null ? (
                        <div className="mb-4">
                            {results.mlu !== null && <p>MLU Score: {results.mlu}</p>}
                            {results.wps !== null && <p>WPS Score: {results.wps}</p>}
                            {results.cps !== null && <p>CPS Score: {results.cps}</p>}
                        </div>
                    ) : null}
                    <p>{results.processedText}</p>
                </div>
                {results.imageUrl && (
                    <div className="w-40">
                        <img src={results.imageUrl} alt="Result Illustration" className="rounded-lg" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageAnalyticsApp;

