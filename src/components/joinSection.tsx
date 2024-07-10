import React from 'react'
import Image from 'next/image'

const GetApp = () => {
  return (
    <section
    className="flex justify-center items-center w-[85%]  sm:my-16 my-6  px-6 sm:py-12 py-4 sm:flex-row flex-col rounded-[20px] box-shadow">
      <div 
       style={{
        background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
      }}  className="flex justify-center items-center flex-wrap w-full">
        <div className="z-20 flex w-full flex-1 flex-col items-start justify-center gap-12">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[320px]">Get for free now!</h2>
          <p className="regular-16 text-gray-10">Available on iOS and Android</p>
          <div className="flex w-full flex-col gap-3 whitespace-nowrap xl:flex-row">
            <button><h1>join us</h1></button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Image src="/join.png" alt="phones" width={550} height={870} />
        </div>
      </div>
    </section>
  )
}

export default GetApp