"use client"
import axios from "axios";
import { color } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
const pricingData = [
  {
    mainTitle: "For Individuals",
    secondTitle: "Basic",
    infoNote: "Ideal for individuals who need quick access to basic features.",
    isSelected: false,
    monthlyPrice: 0,
    yerlyPrice: 0,
    color : "bg-[#FD4677]",
    logo: "/pricing1.png",
    getIn: [
      {
        rightIcon: true,
        description: "Only for individuals",
      },
      {
        rightIcon: true,
        description: "0 credit",
      },
      {
        rightIcon: false,
        description: "5 free barter Points(monthly)",
      },
      {
        rightIcon: false,
        description: "No free listing on our social platform",
      },
      {
        rightIcon: false,
        description: "No directory listing",
      },
      {
        rightIcon: false,
        description: "Access to facebook community",
      },
      {
        rightIcon: false,
        description: "No trade shows",
      },
    ],
  },
  {
    mainTitle: "For startups",
    secondTitle: "Basic",
    monthlyPrice: 499,
    yerlyPrice: 4999,
    infoNote: "Ideal for individuals who need quick access to basic features.",
    isSelected: true,
    logo: "/pricing3.png",
    getIn: [
      {
        rightIcon: true,
        description: "Free Directory Listing",
      },
      {
        rightIcon: true,
        description: "Customer service Support",
      },
      {
        rightIcon: false,
        description: "25000 line of credit",
      },
      {
        rightIcon: false,
        description: "10 free barter Points (monthly)",
      },
      {
        rightIcon: false,
        description: "No free listing on our social platform",
      },
      {
        rightIcon: false,
        description: "Normal directory listing",
      },
      {
        rightIcon: false,
        description: "Access to facebook community",
      },
      {
        rightIcon: false,
        description: "No trade shows",
      },
    ],
  },
  {
    mainTitle: "For big companies",
    secondTitle: "Premium",
    infoNote: "Ideal for individuals who need quick access to basic features.",
    isSelected: false,
    monthlyPrice: 999,
    yerlyPrice: 9999,
    color : "bg-[#FD4677]",
    logo: "/pricing2.png",
    getIn: [
      {
        rightIcon: true,
        description: "Free Directory Listing",
      },
      {
        rightIcon: true,
        description: "Customer service Support",
      },
      {
        rightIcon: false,
        description: "50,000 line of credit",
      },
      {
        rightIcon: false,
        description: "100 free barter Points (Monthly)",
      },
      {
        rightIcon: false,
        description: "Free listing on youtube channel",
      },
      {
        rightIcon: false,
        description: "Bold directory listing",
      },
      {
        rightIcon: false,
        description: "Access to facebook community",
      },
      {
        rightIcon: false,
        description: "Trade shows",
      },
    ],
  },
];

const Pricing = () => {
  const [monthPrice, setMonthPrice] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
    setMonthPrice(!monthPrice)
  }
  
  const createSubscription = () => {
    if (!isSignedIn) {
      router.push('/signin');
    }
    setLoading(true)
   axios.post('/api/create-subscription', {})
   .then((res) => {
      console.log(res.data)
      OnPayment(res.data.id)
    },(error)=>{
      setLoading(false);
    })
  }

  const OnPayment = (subId:string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      subscription_id: subId,
      currency: "INR",
      name: "Barter Club",
      description: "monthly subscription",
      image: "/logo.png",
      handler: async(response:any) => {
        console.log(response);
        setLoading(false);
      }, 
  }
// @ts-ignore
  const rzp =new window.Razorpay(options);
  rzp.open();
}


  return (
    <section className="flex flex-col justify-center items-center py-3 min-h-screen">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      {/* heading section  */}
      <div className="flex flex-col w-auto px-6 text-center text-2xl sm:text-3xl md:text-4xl">
        <span className="font-bold text-slate-300 text-xl">Pricing</span>
        <span
          className="text-3xl  text-slate-200 font-bold sm:text-2xl lg:text-4xl "
        >
          Simple, Transparent Pricing
        </span>
        <span className="text-base leading-relaxed text-slate-300 mt-4">
          Chose a plan that&apos;s right for you
        </span>
        <div className="text-base mb-8 sm:mt-5 gap-4 flex items-center justify-center pl-5">
        <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <span className='label flex items-center text-sm font-medium text-slate-300'>
          Monthly
        </span>
        <span
          className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
            isChecked ? 'bg-gray-700 border border-[#FD4677]' : 'bg-[#CCCCCE]'
          }`}
        >
          <span
            className={`dot h-6 w-6 rounded-full  duration-200 ${
              isChecked ? 'translate-x-[28px] bg-[#FD4677]' : 'bg-white'
            }`}
          ></span>
        </span>
        <span className='label flex items-center text-sm font-medium text-slate-300'>
          Anually
        </span>
      </label>
        </div>
      </div>
      {/* pricing section   */}
      <div className="flex flex-col lg:flex-row gap-6 h-full px-5">
        {pricingData.map((data, index) => (
          <div
          style={{
            background: data?.isSelected  ? 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%) mt-12':''
          }}
            className={`flex flex-col h-full  max-w-[378px] py-6 px-5 sm:px-10 lg:w-auto xl:w-[378px] rounded-3xl ${
              data?.isSelected
                ? `bg-gradient-to-b from-[#FD4677] to-[#6557FF] text-white `
                : "bg-[#1A1A1A] text-white mt-4 sm:mt-12"
            }`
        }
        
            key={index}
          >
            <div className="flex mt-6 flex-col text-left">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-2">
                 <Image alt="pricing-loco" src={data?.logo} width={56} height={56}/>  
                 <div className="flex flex-col">
                <span className="text-lg text-slate-100">{data?.mainTitle}</span>
                <span className="text-xl text-white">{data?.secondTitle}</span>
                </div>
                 {data?.secondTitle =="Pro" && <button className="bg-white bg-opacity-10 px-3 py-2 ml-7 rounded-xl">popular</button> }   
                </div>
                <span>{data?.infoNote}</span>
              </div>
              <div className="flex items-center gap-3 my-4">
                <span className={`text-6xl font-semibold`}
                 style={{ color: data?.color ? '#FD4677' : 'inherit' }}>
                  ₹{monthPrice ? data?.monthlyPrice : data?.yerlyPrice}
                </span>
                <span className="font-light">
                  /&nbsp;&nbsp;{monthPrice ? "Monthly" : "Anually"}
                </span>
              </div>
              <h2>What's included</h2>
              <div className="mt-2 space-y-3">
                {data?.getIn?.map((description, index) => (
                  <div className="flex items-center gap-4 max-w-xs" key={index}>
                    <div className="w-5  h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <span className="font-medium text-base">
                      {description?.description}
                    </span>
                  </div>
                ))}
              </div>
              <button
              disabled={loading}
               onClick={()=>(createSubscription())}
                className={`w-full border-[1px] flex items-center justify-center gap-2 mt-5 mb-4 rounded-3xl py-2.5 ${
                  data?.isSelected
                    ? "bg-transparent"
                    : "bg-gradient-to-b from-pink-500 to-indigo-500  border-none"
                }`}
              >
                <span className="text-base font-medium">
                  {loading ? 'Loading...' : 'Get Started'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Pricing;
