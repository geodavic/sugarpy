import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Help from './Help';

// Import types from Home
import type { MetricsResults, DetailedMetric } from './Home';

function App() {
  // Form state
  const [inputText, setInputText] = useState('');
  const [ageYears, setAgeYears] = useState(4);
  const [ageMonths, setAgeMonths] = useState(0);
  
  // API and UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState<MetricsResults>({
    mlu: { score: null, processedText: '', imageUrl: '', result: '', numerator: null, denominator: null },
    wps: { score: null, processedText: '', imageUrl: '', result: '', numerator: null, denominator: null },
    cps: { score: null, processedText: '', imageUrl: '', result: '', numerator: null, denominator: null },
    tnw: { score: null, processedText: '', imageUrl: '', result: '' }
  });
  const [activeTab, setActiveTab] = useState<DetailedMetric>('mlu');
  const [modalImage, setModalImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabsOpen, setTabsOpen] = useState(false);
  const [exportTableLoading, setExportTableLoading] = useState(false);
  const [exportPlotsLoading, setExportPlotsLoading] = useState(false);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Home 
            inputText={inputText}
            setInputText={setInputText}
            ageYears={ageYears}
            setAgeYears={setAgeYears}
            ageMonths={ageMonths}
            setAgeMonths={setAgeMonths}
            loading={loading}
            setLoading={setLoading}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            results={results}
            setResults={setResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            modalImage={modalImage}
            setModalImage={setModalImage}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            tabsOpen={tabsOpen}
            setTabsOpen={setTabsOpen}
            exportTableLoading={exportTableLoading}
            setExportTableLoading={setExportTableLoading}
            exportPlotsLoading={exportPlotsLoading}
            setExportPlotsLoading={setExportPlotsLoading}
          />
        } 
      />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  );
}

export default App;

