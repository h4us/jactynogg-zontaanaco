import Footer from '@/app/components/footer';

export default function Home() {
  return (
    <>
      <main className="w-screen h-screen flex items-center content-center">
        <figure className="w-full aspect-[16/9]">
          <img
            src="http://192.168.1.12:8081/stream"
            className="w-full object-contain" />
        </figure>
      </main>
      <Footer />
    </>
  );
}
