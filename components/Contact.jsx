"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-md mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-400 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-400 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-400 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white transition flex items-center justify-center ${
            isLoading ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
};

export default Contact;
