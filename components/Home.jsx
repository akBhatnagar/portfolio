const Home = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 transition-colors duration-500"
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">Akshay Bhatnagar</span>
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-8 text-gray-700 dark:text-gray-300">
        Full Stack Developer based in Milton Keynes, UK 🚀 <br />
        I build modern, responsive, and performant web applications.
      </p>
      <button
        onClick={() => {
          const projectsSection = document.getElementById("projects");
          if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View My Work
      </button>
    </section>
  );
};

export default Home;
