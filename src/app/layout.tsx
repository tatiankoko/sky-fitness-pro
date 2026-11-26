import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import ReduxProvider from '@/store/ReduxProvider';
import Header from '@/components/header/Header';
import { Bounce, ToastContainer } from 'react-toastify';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SkyFitnessPro',
  description: 'Онлайн-тренировки для занятий дома',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <ReduxProvider>
      <html lang="en" className={`${roboto.variable}`}>
        <body className="min-h-full flex flex-col">
          <div className="wrapper">
            <div className="container">
              <Header />
              <main className="main">{children}</main>
            </div>
          </div>
        </body>
      </html>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </ReduxProvider>
  );
}
