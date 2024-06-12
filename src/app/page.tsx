import Image from "next/image";
import Searchbar from "./components/Searchbar";
import HeroCarousel from "./components/HeroCarousel";
import Clients from "./components/Clients";
// import HeroCarousel from "./components/HeroCarousel";

const  Home = async () => {
  return (
   <>
   <section className="  " style={{
    // backgroundImage: `url(${'/bg.png'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }}>
        <div className="flex max-xl:flex-col pb-12 gap-16" >
          <div className="flex flex-col ml-4 pb-6 sm:pb-2 justify-center"> 
            <h1 className="mt-24 sm:mt-4 text-6xl leading-[72px] font-semibold tracking-[-1.5px] sm:tracking-[-1.2px] text-gray-900">
              Unleash the Power of
              <span className="text-primary"> WatchTheDrop</span>
            </h1>

            <p className="mt-6 px-4">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>

            <Searchbar />
          </div>

          <HeroCarousel />
        </div>
        <div className="flex items-center justify-center">

       <Clients/>
        </div>
      </section>
   </>
  );
}

export default Home;