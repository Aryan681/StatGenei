import React from "react";
import Hero from "../compo/Home/Hero";
import Feature from "../compo/Home/Feture";
import Preview from "../compo/Home/Preview";
import HowItWorks from "../compo/Home/Work";
import LooseStringCursor from "../compo/Home/LooseString";
import LooseStringVariant from "../compo/Home/Loose2";
import NewFooter from "../bais/Footer"; 
import "./Home.css"
const DataDashboardLanding = () => {
  return (
    <div className="min-h-screen bg-white text-white overflow-hidden">
      {/* Section 1: Hero */}
      <Hero />

      <div className="smoky-gradient-div"></div>

      {/* Section 2: Features */}
      <Feature />
      <LooseStringCursor />

      {/* Section 3: Dashboard Preview */}
      <Preview />
      <LooseStringVariant />

      {/* Section 4: How It Works */}
      <HowItWorks />

      {/* Footer  */}
      <NewFooter />
    </div>
  );
};

export default DataDashboardLanding;