import React from "react";
import Hero from "../compo/Home/Hero";
import Feature from "../compo/Home/Feture";
import Preview from "../compo/Home/Preview";
import HowItWorks from "../compo/Home/Work";
import LooseStringCursor from "../compo/Home/LooseString";
import LooseStringVariant from "../compo/Home/Loose2";
import NewFooter from "../bais/Footer";
import "./Home.css";

const DataDashboardLanding = ({ homeRef, featuresRef, footerRef }) => {
  return (
    <div className="min-h-screen bg-white text-white overflow-hidden">
      <Hero ref={homeRef} />
      <div className="smoky-gradient-div"></div>
      <Feature ref={featuresRef} />
      <LooseStringCursor />
      <Preview />
      <LooseStringVariant />
      <HowItWorks />
      <NewFooter ref={footerRef} />
    </div>
  );
};

export default DataDashboardLanding;
