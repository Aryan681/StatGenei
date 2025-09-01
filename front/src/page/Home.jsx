import React from "react";
import Hero from "../compo/Home/Hero";
import Feature from "../compo/Home/Feture";
import Preview from "../compo/Home/Preview";
import HowItWorks from "../compo/Home/Work";
import LooseStringCursor from "../compo/Home/LooseString";
import LooseStringVariant from "../compo/Home/Loose2";
import NewFooter from "../bais/Footer"; 
import "./Home.css"

// Correctly receive all three refs as a single props object
const DataDashboardLanding = ({ homeRef, featuresRef, footerRef }) => {
  return (
    <div className="min-h-screen bg-white text-white overflow-hidden">
      {/* Section 1: Hero */}
      <Hero ref={homeRef} />

      <div className="smoky-gradient-div"></div>

      {/* Section 2: Features */}
      <Feature ref={featuresRef} /> 
      <LooseStringCursor />

      {/* Section 3: Dashboard Preview */}
      <Preview />
      <LooseStringVariant />

      {/* Section 4: How It Works */}
      <HowItWorks />

      {/* Footer  */}
      <NewFooter ref={footerRef} />
    </div>
  );
};

export default DataDashboardLanding;