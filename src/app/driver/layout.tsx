import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Portal | The XVIII Brew Co.',
  description: 'Delivery Partner App for The XVIII Brew Co.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'XVIII Driver',
  },
};

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0e0b08] min-h-screen text-[#EDE3D0] selection:bg-[#B8956A]/30 pb-20">
      {/* 
        This is the layout specifically for the driver web app. 
        No global navbar or footer. 
        pb-20 is for a potential bottom navigation bar.
      */}
      {children}
    </div>
  );
}
