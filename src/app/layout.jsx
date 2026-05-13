import "./globals.css";

export const metadata = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",  
  title: "Cafe Express",
  description: "Menú digital para cafeteria express",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}