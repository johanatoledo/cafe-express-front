import "./globals.css";

export const metadata = {
  title: "Pedido Express",
  description: "Menú digital para restaurante chifa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}