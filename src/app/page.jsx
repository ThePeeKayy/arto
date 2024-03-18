import React from "react";
import HeroBanner from "../../components/HeroBanner";
import PopularProducts from "../../components/PopularProducts";
import FeaturedArtists from "../../components/FeaturedArtists";
import Footer from "../../components/Footer";
import JoinTeam from "../../components/JoinTeam";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-1 px-4">
        
        <HeroBanner/>
        <div className="p-24">
          <PopularProducts/>
          <FeaturedArtists/>
          <JoinTeam />
        </div>
        <Footer/>
      </div>
      
    </div>
  );
}
