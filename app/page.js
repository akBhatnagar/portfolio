"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(localStorage.getItem("darkMode") === "true");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(() => {
    const sections = ["home", "about", "projects", "contact"];

    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-grow pt-20">
        <section id="home" className="min-h-screen py-20">
          <Home />
        </section>
        <section id="about" className="min-h-screen py-20">
          <About />
        </section>
        <section id="projects" className="min-h-screen py-20">
          <Projects />
        </section>
        <section id="contact" className="min-h-screen py-20">
          <Contact />
        </section>
      </main>
      <Footer className="mt-auto" />
      <BackToTop />
    </div>
  );
}
