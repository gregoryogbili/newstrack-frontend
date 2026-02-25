import TopNav from "../components/TopNav";
import CategoryPage from "../components/CategoryPage";
import Image from "next/image";

export default function Live() {
  return (
    <>
      <TopNav
        active="/live"
        logoImg={
          <Image
            src="/logo.png"
            alt="NewsTrac Logo"
            width={34}
            height={34}
          />
        }
      />

      <CategoryPage
        categoryKey="live"
        title="LIVE NEWS"
        subtitle="Developing stories in real time"
      />
    </>
  );
}