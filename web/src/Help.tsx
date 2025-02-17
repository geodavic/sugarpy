import { Link } from 'react-router-dom';
import './index.css';

const HelpPage = () => {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Header Section */}
      <header className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-baseline">
          <h1 className="text-4xl font-bold text-white">Help</h1>
        </div>
        <div className="mt-2 flex justify-end space-x-4">
          <Link to="/" className="text-sm text-blue-300 hover:underline">Home</Link>
          <Link to="/about" className="text-sm text-blue-300 hover:underline">About & Contact</Link>
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
            If you are unfamiliar with the <a href="https://www.sugarlanguage.org/" target="_blank">SUGAR</a> method, please consult their resources first before using this tool. In addition, we have compiled a collection of tips and resources to augment and improve your SUGAR process on our <a href="https://languagesamples.com" target="_blank">website</a>, including tips for collecting the sample and how to use the results from this tool in your reports.
        </p>

        To use this tool, follow these steps:
        <br></br>
        <br></br>

        <h2 className="text-xl font-bold"> Step 1: Collect </h2>
        Collect your language sample using the guidelines set forth in the resources above.
        <br></br>
        <br></br>

        <h2 className="text-xl font-bold"> Step 2: Paste  </h2>
        Once you have collected your 50-utterance language sample, paste it into this tool. Be sure you are only copying the raw utterances (don't add line numbers or anything) as well as make sure each utterance gets its own line. <b>This is very important</b>.
        <br></br>
        <br></br>
        Select the age of the child (must be between the ages of 3;0 and 10;11), and click "Calculate metrics". The tool will sometimes take a little while to finish its analysis, so please be patient.
        <br></br>
        <br></br>

        <h2 className="text-xl font-bold"> Step 3: Check </h2>
        When it finishes, it will show the four SUGAR scores in a table like this:
        <img src="/help-table.png"></img>

        Here you can see the individual scores and whether they meet the normative criteria. A score meets the criteria if it is above two standard deviations below the mean. You can see what the means and standard deviations are across age groups on the SUGAR <a href="https://www.sugarlanguage.org/downloads" target="_blank">downloads</a> page.

        This table also allows you to visualize the score on a bell curve by clicking "View Image".
        <br></br>
        <br></br>

        If you want to see how the tool got these numbers, click on "Show Details". There you will see, for each score, a breakdown for each utterance of how many of each unit contributed to that score. For example, with MLU if you see a line like:
        <img src="/help-mlu-line.png" className="small"></img>
        this means there are 7 morphemes in that utterance. The word "playing" is highlighted to indicate it contributes more than one morpheme.

        <br></br>
        <br></br>
        At the bottom of each breakdown is the final calculation to produce the score:
        <img src="/help-mlu-score.png" className="small"></img>

        You can use these to explicitly see how it got the scores it produced in the table. This allows you to spot check the tool and make sure it is counting the relevant parts of speech correctly. As with all AI tools, it can make mistakes. If it does, please let us know!
        <br></br>
        <br></br>


        <h2 className="text-xl font-bold"> Step 4: Export </h2>

        You can export your results by clicking "Export table" and "Export plots". The former exports the table you saw above for inclusion into a report. The latter exports the bell curve plots.

      </div>
    </div>
  );
};

export default HelpPage;
