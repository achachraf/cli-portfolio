"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { InputRefProvider, useInputRef } from '@/context/InputRefContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <title>Achraf&apos;s CLI Portfolio</title>
        <meta name="description" content="CLI Portfolio of Achraf Achkari" />
      </head>
      <body className={inter.className}>
      <InputRefProvider>
        <LayoutContent>{children}</LayoutContent>
      </InputRefProvider>
      </body>
      </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const inputRef = useInputRef();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="rounded-lg shadow-md w-3/4" onClick={() => inputRef.current?.focus()}>
          <div className="flex items-center justify-between p-3 bg-slate-300 rounded-t-lg">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          {children}
        </div>
      </div>
  );
}