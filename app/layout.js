
import Providers from "./components/sessionWrapper";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        
      >
      <Providers>
            <Toaster position="top-right" reverseOrder={false} />
        {children}
      </Providers>
      
      </body>
    </html>
  );
}
