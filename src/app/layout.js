import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "אתר הנצחה - יומן חיילים",
  description: "אתר הנצחה מכובד לחיילים שנפלו, המציג חייל אחד לכל יום לפי יום ההולדת",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
