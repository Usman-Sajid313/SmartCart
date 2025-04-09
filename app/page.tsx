import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import PromoBanner from "./components/PromoBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import BrowseByCategory from "./components/BrowseByCategory";
import ConfusedSection from "./components/ConfusedSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div>
      <AnnouncementBar />
      <Navbar />
      <PromoBanner />
      <FeaturedProducts/>
      <BrowseByCategory/>
      <ConfusedSection/>
      <Footer/>
    </div>
  );
}
