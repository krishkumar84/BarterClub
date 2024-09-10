
export function Affiliate() {
    return (
      <section>
        <div className="px-12 pt-12 lg:flex lg:flex-row lg:items-center">
          <div className="w-full flex items-center justify-center lg:w-1/2">
            <img
              src="/affiliate.jpg"
              alt="about us image"
              className="h-auto w-[80%] rounded-md object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="my-10 lg:my-0 lg:px-10">
              <h2 className="text-3xl font-bold  text-slate-300 sm:text-4xl lg:text-5xl">
              Join Barterclub's Affiliate Program!
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              Looking to earn while sharing the benefits of barter with others? Join Barterclub’s Affiliate 
              Program today! As a partner, you'll earn commissions for every new member you refer. It’s 
              easy—simply share your unique link, help others discover a smarter way to trade, and watch 
              your earnings grow. Sign up now and start spreading the word!
              
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              It’s a win-win: help others discover the power of barter, while you earn. Join today and start 
              earning with Barterclub! 
              </p>

              <form action="#" method="POST" className="mt-8 max-w-xl">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <button
                    type="button"
                    style={{
                      background:
                        "linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)",
                    }}
                    className="rounded-3xl  px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Learn More
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
  