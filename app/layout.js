import "./globals.css";

export const metadata = {
  title: "DAF Emissie Tracker",
  description: "CO2-emissietracker voor dienstreizen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
