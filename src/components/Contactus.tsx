import React from 'react'

export function Contact() {
  return (
    <section className='w-[85%]'>
      <div className="px-2 lg:flex lg:flex-row lg:items-center ">
        <div className="w-full bg-zinc-900 py-8 lg:w-1/2 rounded-3xl">
          <div className="my-10 lg:my-0 lg:px-10">
          <h2 className="text-3xl font-bold  text-white sm:text-4xl lg:text-5xl">
             If you have Questions, Feel free to contact us
              </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nesciunt eos facilis
              debitis voluptas iure consectetur odit fugit voluptate recusandae?
            </p>

            <form action="#" method="POST" className="mt-8 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                    type="email"
                    placeholder="Email"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
         style={{
            background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
          }} 
          className="w-full p-5 pb-28 pt-20 lg:w-1/2 rounded-3xl ">
          <div className="flex flex-wrap gap-7">
          <div className="h-10 w-10 flex-shrink-0">
                 <img
                     className="h-10 w-10 rounded-full object-cover ring-4 ring-white ring-opacity-15"
                     src='/avatar.png'
                     alt="avatar"
                 />
           </div>      
            <div className="text">
                <div className="text-white text-lg font-medium"><h2>Priya Sharma</h2></div>
                <div className="text-white text-sm font-medium"><p>Delhi</p></div>
            </div>
          </div>
          <div className="two">
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-100">
           Being a member of the barter club has been an incredible experience. I've exchanged my handmade crafts for essentials
            like groceries and even got professional services for my business without spending a rupee.
            It's not just about saving money; it's about building relationships and supporting local businesses
              </p>
          </div>
        </div>
      </div>
    </section>
  )
}
