// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Endless Runner",
  description: "An endless runner game built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add favicon or additional meta tags here */}
      </head>
      <body>{children}</body>
    </html>
  );
}
