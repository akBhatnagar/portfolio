"use client";

import Image from "next/image";

const Navbar = ({ activeSection, setActiveSection, isDarkMode, toggleDarkMode }) => {
  const sections = ["home", "about", "projects", "contact"];

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-10 transition-colors duration-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
          className="cursor-pointer rounded-full overflow-hidden ring-2 ring-blue-600 dark:ring-blue-400 transition-transform duration-300 hover:scale-110"
          aria-label="Go to Home"
          style={{ width: 80, height: 80 }}
        >
          <Image
            src="/memoji.png"
            alt="Akshay Logo"
            width={80}
            height={80}
            className="object-cover"
            priority
          />
        </button>

        <ul className="flex space-x-4 md:space-x-6 items-center">
          {sections.map((section) => (
            <li key={section}>
              <button
                onClick={() => {
                  document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(section);
                }}
                className={`capitalize transition-colors duration-300 ${
                  activeSection === section
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {section}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={toggleDarkMode}
              className="ml-4 px-2 py-1 rounded text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
