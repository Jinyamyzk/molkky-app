import "./global.css";

export const metadata = {
  title: "Mölkky Game App",
  description: "Scoring app for the Mölkky game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="contaner">{children}</div>
      </body>
    </html>
  );
}
