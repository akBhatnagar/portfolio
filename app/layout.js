import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { getContent } from "@/lib/db";
import { getTheme } from "@/lib/themes";

export const metadata = {
  title: "Akshay Bhatnagar | Full Stack Portfolio 🚀",
  description: "Akshay Bhatnagar | Full Stack Developer Portfolio",
  icons: {
    icon: "/memoji.png",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  let themeStyle = "";
  try {
    const themeKey = getContent("color_theme") || "blue";
    const theme = getTheme(themeKey);
    themeStyle = Object.entries(theme.primary)
      .map(([shade, rgb]) => `--color-primary-${shade}: ${rgb}`)
      .join("; ");
  } catch {
    // DB not initialized yet — use CSS defaults
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {themeStyle && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root { ${themeStyle}; }`,
            }}
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('darkMode') === 'true') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
