import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Help from './Help';

function App() {
  // Lift the form state up here.
  const [inputText, setInputText] = useState('');
  const [ageYears, setAgeYears] = useState(4);
  const [ageMonths, setAgeMonths] = useState(0);

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
          />
        } 
      />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  );
}

export default App;

