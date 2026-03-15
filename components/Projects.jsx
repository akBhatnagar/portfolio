const projects = [
  {
    title: "Portfolio Website",
    description:
      "A modern portfolio website built with React and Tailwind CSS showcasing my skills and projects.",
    link: "https://akshaybhatnagar.in",
  },
  {
    title: "Task Manager App",
    description:
      "A full-stack task manager app with user authentication, built using MERN stack.",
    link: "https://comingsoon.akshaybhatnagar.in",
  },
  {
    title: "E-commerce Store",
    description:
      "An online store prototype built with React and Stripe for payments integration.",
    link: "https://comingsoon.akshaybhatnagar.in",
  },
  {
    title: "To-Do Application",
    description:
      "A simple and efficient to-do app to organize tasks by groups, built with React, Express, and SQLite.",
    link: "https://todo.akshaybhatnagar.in/",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map(({ title, description, link }, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-6 shadow bg-white dark:bg-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
