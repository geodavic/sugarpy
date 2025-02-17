import { Link } from 'react-router-dom';
import './index.css';

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Header Section */}
      <header className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-baseline">
          <h1 className="text-4xl font-bold text-white">About &amp; Contact</h1>
        </div>
        <div className="mt-2 flex justify-end space-x-4">
          <Link to="/" className="text-sm text-blue-300 hover:underline">Home</Link>
          <Link to="/help" className="text-sm text-blue-300 hover:underline">Help</Link>
          <a
            href="https://github.com/geodavic/sugarpy"
            className="text-sm text-blue-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
        </div>
      </header>

      {/* Content Section */}
      <div className="w-full max-w-2xl p-4 bg-white text-black rounded">
        <p className="mb-4">
            This is a language sample calculator based on the <a href="https://www.sugarlanguage.org/" target="_blank">SUGAR</a> method for evaluating language impairments in children. From the SUGAR website:
            <br></br>
            <br></br>
            <blockquote cite="https://www.sugarlanguage.org/">
            <i>SUGAR is a tool for enabling speech-language pathologists (SLPs) to use language sample analysis (LSA) as a regular part of a comprehensive assessment of children with possible language impairment.</i>
            </blockquote>
            <br></br> 
            Given a 50-utterance langauge sample from a child collected by a professional SLP, this tool uses Natural Language Processing and Machine Learning to calculate the four SUGAR metrics: <b>Mean Length of Utterance (MLU)</b>, <b>Clauses Per Sentence (CPS)</b>, <b>Words Per Sentence (WPS)</b>, and <b>Total Number of Words (TNW)</b> for that sample. If some or all of a child's scores fall significantly below established averages, it is an indication of language impairment. 
        </p>
        <hr className="w-full my-2 border" />
          This tool was developed and built by by Dr. George D. Torres, a machine learning scientist, in collaboration with Dr. Kristen K. Torres, a professional Speech Language Pathologist.
          <br></br>
          <br></br>
          For inquiries or more information, please email us at{' '}
          <a
            href="mailto:digitalmetricsfortheslp@gmail.com"
            className="text-blue-500 hover:underline"
          >
            digitalmetricsfortheslp@gmail.com
          </a>.
          <br></br>
          <br></br>
          Visit our{' '}
          <a
            href="https://www.languagesamples.com/home"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            website
          </a>{' '}
          for additional resources.
        <hr className="w-full my-2 border" />
        <b>Disclaimer:</b> This tool can make mistakes. Please check the results it produces before using them to make any formal recommendations. Instructions for how to check its analysis can be found by clicking "Help" above.
      </div>
    </div>
  );
};

export default AboutPage;

