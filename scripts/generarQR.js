import QRCode from "qrcode";
import path from "path";

const urlMenu = "https://pedido.tonav-tech.online";

const outputPath = path.join(process.cwd(), "public", "qr-menu.png");

QRCode.toFile(outputPath, urlMenu, {
  width: 1000,
  margin: 2,
  color: {
    dark: "#1F1F1F",
    light: "#FFFFFF",
  },
})
  .then(() => {
    console.log("✅ QR generado correctamente:");
    console.log(outputPath);
  })
  .catch((error) => {
    console.error("❌ Error generando QR:", error);
  });