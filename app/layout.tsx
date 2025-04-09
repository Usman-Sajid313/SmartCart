import './globals.css';
import { UserProvider } from '@/context/UserContext';

export const metadata = {
  title: 'SmartCart',
  description: 'Your e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
