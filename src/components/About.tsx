
export function AboutUs() {
  return (
    <section>
      <div className="px-12 mt-12 lg:flex lg:flex-row lg:items-center">
        <div className="w-full flex items-center justify-center lg:w-1/2">
          <img
            src="/about-us.png"
            alt="about us image"
            className="h-auto w-[80%] rounded-md object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="my-10 lg:my-0 lg:px-10">
            <h2 className="text-3xl font-bold  text-slate-300 sm:text-4xl lg:text-5xl">
              About Us
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              At BarterClub, we believe in the power of collaboration and
              community. Our platform is designed to connect business owners,
              professionals, service providers, and entrepreneurs who want to
              unlock the full potential of their resources. We facilitate the
              exchange of goods and services within a vibrant barter community,
              offering a unique opportunity to advertise, market, and network
              with a wider audience while fostering a circular economy.
            </p>
            <form action="#" method="POST" className="mt-8 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center">
                  <button
                    type="button"
                    style={{
                        background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
                      }}
                    className="rounded-3xl  px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Read More
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
