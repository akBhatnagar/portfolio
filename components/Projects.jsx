const defaultProjects = [
  {
    title: "Portfolio Website",
    description: "A modern portfolio website built with React and Tailwind CSS showcasing my skills and projects.",
    link: "https://akshaybhatnagar.in",
  },
  {
    title: "To-Do Application",
    description: "A simple and efficient to-do app to organize tasks by groups, built with React, Express, and SQLite.",
    link: "https://todo.akshaybhatnagar.in/",
  },
];

const Projects = ({ projects, showGithubLinks }) => {
  const displayProjects = projects?.length ? projects : defaultProjects;

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {displayProjects.map((project, idx) => (
          <div
            key={project.id || idx}
            className="border rounded-lg p-6 shadow bg-white dark:bg-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
            <div className="flex gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View Project
                </a>
              )}
              {showGithubLinks && project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.263.793-.583 0-.287-.01-1.04-.015-2.04-3.338.724-4.042-1.612-4.042-1.612-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.996.108-.774.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.046.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.874.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.103.823 2.222 0 1.606-.015 2.9-.015 3.293 0 .322.192.7.8.58C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
