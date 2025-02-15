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
          <a href="index.html" className="text-sm text-blue-300 hover:underline">
            Home
          </a>
          <a href="about.html" className="text-sm text-blue-300 hover:underline">
            About & Contact
          </a>
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut
          ligula non mi varius sagittis. Nullam quis ante. Etiam sit amet orci eget
          eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.
        </p>
        <p className="mb-4">
          For inquiries or more information, please email us at{' '}
          <a
            href="mailto:contact@example.com"
            className="text-blue-500 hover:underline"
          >
            contact@example.com
          </a>.
        </p>
        <p className="mb-4">
          Visit our{' '}
          <a
            href="https://example.com"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            website
          </a>{' '}
          for additional resources.
        </p>
        <p>
          Follow us on{' '}
          <a
            href="https://twitter.com/example"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{' '}
          or check out our{' '}
          <a
            href="https://linkedin.com/in/example"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{' '}
          page.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
