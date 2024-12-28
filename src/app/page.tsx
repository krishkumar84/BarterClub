import Image from "next/image";
import Searchbar from "../components/Searchbar";
import HeroCarousel from "../components/HeroCarousel";
import Clients from "../components/Clients";
import { AboutUs } from "../components/About";
import { Affiliate } from "../components/Affiliate";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import ProductReel from "../components/ProductReel";
import GetApp from "@/components/joinSection";
import { Contact } from "@/components/Contactus";
import { Footer } from "@/components/Footer";
import Pricing from "@/components/Pricing";
import Header from "@/components/navbar";
import TextTransition from "@/components/TextTransition";
import AccordionExample from "@/components/Accordian";
// import HeroCarousel from "./components/HeroCarousel";

const  Home = async () => {

  return (
   <>
   <script src="//code.tidio.co/bh8md3putkqxfjunssu6cqckfhniebqg.js" async></script>
   <section  
    id="home"
    style={{
    backgroundImage: `url("${'/bg2.svg'}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }} >
      <Header/>
        <div className="flex max-xl:flex-col pb-12 px-2 sm:px-12 gap-16" >
          <div className="flex flex-col ml-4 pb-6 sm:pb-2 justify-center"> 
            <h1 className="mt-24 sm:mt-4 text-6xl leading-[72px] font-semibold tracking-[-1.5px] sm:tracking-[-1.2px] text-slate-200">
              Unleash the 
              <span className="text-primary text-slate-100"> BarterClub</span>
            </h1>
            <div className="mt-6 scale-y-110 h-12 px-5">
          <TextTransition />
        </div>

            {/* <p className="mt-6 text-gray-300 px-4">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p> */}

            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
       <div className="flex-col flex items-center justify-center gap-12 mb-24">
       {/* <Clients/> */}
       <div id="about">
            <AboutUs />
       </div>
       <div id="pricing">
            <Pricing />
          </div>
       <Affiliate/>
        <div id="contact">
        <Contact/>
        </div>
       <GetApp/>
       <div id="faq">
        <AccordionExample/>
        </div>
        </div>
       <Footer/>
      </section>
      {/* <MaxWidthWrapper>
      <ProductReel
          href='/products?sort=recent'
          title='Brand new'
        />
       </MaxWidthWrapper>  */}
   </>
  );
}

export default Home;