import Background from "@/assets/img/Background.webp";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black h-25000">
      <Image src={Background} alt="Background" width={1920} height={1080} className="w-full h-screen object-cover brightness-30" />
      {
        Array.from({ length: 1000 }).map((_, index) => (
          <div key={index} className="w-full h-24 border-b">a</div>
        ))
      }
    </div>
  );
}
