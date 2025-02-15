import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Help from './Help';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  );
}

export default App;

