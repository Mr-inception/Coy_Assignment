import "./globals.css";

export const metadata = {
  title: "Coy Discover",
  description: "Swipe, match, and keep your crushes private until it's mutual.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}