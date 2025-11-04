// src/app/layout.js

import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body' 
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-title' 
});

export const metadata = {
  title: 'Evolvi Nutri - O Futuro da Sua Saúde',
  description: 'Calcule sua dieta personalizada com tecnologia e ciência.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${poppins.variable}`}>{children}</body>
    </html>
  );
}