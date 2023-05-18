import Preference from '@/app/components/preference';
import Footer from '@/app/components/footer';
import Mjpeg from '@/app/components/mjpeg';

export default function Home() {
  return (
    <>
      <Preference />
      <main className="w-screen h-screen flex items-center content-center">
        <Mjpeg />
      </main>
      <Footer />
    </>
  );
}
