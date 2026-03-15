const Home = ({ title, subtitle }) => {
  const displayTitle = title || "Hi, I'm Akshay Bhatnagar";
  const displaySubtitle = subtitle || "Full Stack Developer based in Milton Keynes, UK 🚀\nI build modern, responsive, and performant web applications.";

  const namePart = displayTitle.includes("Akshay Bhatnagar")
    ? displayTitle.split("Akshay Bhatnagar")
    : null;

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 transition-colors duration-500"
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        {namePart ? (
          <>
            {namePart[0]}
            <span className="text-primary-600 dark:text-primary-400">Akshay Bhatnagar</span>
            {namePart[1]}
          </>
        ) : (
          displayTitle
        )}
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-8 text-gray-700 dark:text-gray-300">
        {displaySubtitle.split("\n").map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
      <button
        onClick={() => {
          const projectsSection = document.getElementById("projects");
          if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-6 px-6 py-3 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
      >
        View My Work
      </button>
    </section>
  );
};

export default Home;
