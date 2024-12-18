import React from 'react'
import Image from 'next/image'
import {
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

const GetApp = () => {
  return (
    <section
    style={{
      background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
    }} 
    className="flex justify-center items-center w-[85%]  sm:my-16 my-6  p-6 rounded-[20px] box-shadow">
      <div className="flex flex-col-reverse sm:flex-row justify-center items-center flex-wrap px-6 w-full">
        <div className="z-20 flex w-full flex-1 flex-col items-start justify-center gap-4">
        <h2 className="text-3xl font-bold  text-white sm:text-4xl lg:text-5xl">
        Exchange what you want with what you have.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-white">
              swap items or services without spending money. It’s a simple way to get what you want by exchanging things you already own.
              </p>
              <SignedOut>
              <Link href="/signup">
                  <button
                    type="button"
                    className="rounded-3xl bg-white  px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Join in
                  </button>
                </Link>
              </SignedOut>
        </div>

        <div className="flex flex-1 my-4 sm:mt-0 items-center justify-end">
          <Image src="/join.png" alt="phones" width={390} height={250} />
        </div>
      </div>
    </section>
  )
}

export default GetApp