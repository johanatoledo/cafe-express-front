import "./globals.css";


export const metadata = { 
  title: "CAFE EXPRESS",
  description: "Menu Cafe Express",
  icons: {
    icon: "/branding/logo.webp", 
    shortcut: "/branding/logo.webp",
    apple: "/branding/logo.webp", 
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}