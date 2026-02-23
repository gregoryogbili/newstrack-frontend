import TopNav from "../components/TopNav";
import Image from "next/image";

export default function Intelligence() {
  return (
    <>
      <TopNav
        active="/intelligence"
        logoImg={
          <Image
            src="/logo.png"
            alt="NewsTrac Logo"
            width={34}
            height={34}
          />
        }
      />

      <div style={{ padding: 30 }}>
        Intelligence Page
      </div>
    </>
  );
}