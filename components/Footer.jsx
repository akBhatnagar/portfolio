const Footer = ({ className = "" }) => {
  return (
    <footer className={`bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Akshay Bhatnagar. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a
            href="https://github.com/akBhatnagar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.263.793-.583 0-.287-.01-1.04-.015-2.04-3.338.724-4.042-1.612-4.042-1.612-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.996.108-.774.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.046.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.874.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.103.823 2.222 0 1.606-.015 2.9-.015 3.293 0 .322.192.7.8.58C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/akshayb-dev/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-primary-700 dark:hover:text-primary-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4.96v13H.5V8zM9 8h4.77v1.71h.07c.66-1.25 2.27-2.57 4.67-2.57 5 0 5.92 3.29 5.92 7.57V21H18v-6.27c0-1.5-.03-3.44-2.1-3.44-2.11 0-2.44 1.65-2.44 3.35V21H9V8z" />
            </svg>
          </a>
          <a
            href="https://x.com/coder_akshay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-primary-500 dark:hover:text-primary-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.949.555-2.004.959-3.127 1.184-.897-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.206-4.92 4.917 0 .39.045.765.127 1.124-4.083-.205-7.702-2.158-10.126-5.134-.423.722-.666 1.561-.666 2.475 0 1.708.869 3.214 2.188 4.099-.807-.026-1.566-.248-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.828-.413.112-.849.172-1.296.172-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.376 4.604 3.415-1.68 1.318-3.809 2.105-6.102 2.105-.397 0-.788-.023-1.17-.068 2.179 1.396 4.768 2.212 7.557 2.212 9.054 0 14-7.496 14-13.986 0-.209 0-.423-.015-.633.962-.695 1.8-1.562 2.46-2.549z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
