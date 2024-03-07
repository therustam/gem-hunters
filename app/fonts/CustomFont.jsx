import localFont from 'next/font/local';

export const customFont = localFont({
  src: [
    { path: './ClashDisplay-Variable.ttf', format: 'ttf' },
    // Add additional font formats if available (e.g., .ttf)
  ],
});