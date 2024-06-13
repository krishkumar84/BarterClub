
export function Affiliate() {
    return (
      <section>
        <div className="px-12 lg:flex lg:flex-row lg:items-center">
          <div className="w-full flex items-center justify-center lg:w-1/2">
            <img
              src="/affiliate.png"
              alt="about us image"
              className="h-auto w-[80%] rounded-md object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="my-10 lg:my-0 lg:px-10">
              <h2 className="text-3xl font-bold  text-black sm:text-4xl lg:text-5xl">
                Join Our Affiliate Program
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                Sed vulputate risus efficitur metus placerat ultricies. Mauris
                ultrices ultricies nisl sit amet luctus. Maecenas id dictum
                nulla. Nullam condimentum purus id tincidunt dapibus. Vestibulum
                dolor ex, pulvinar ac est sit amet, ultricies pellentesque
                velit. Nunc in urna mi. Aenean a sollicitudin sem, quis egestas
                lectus. Donec ultricies justo laoreet mattis vehicula.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                Suspendisse commodo a erat ut aliquet. Phasellus nec nisl sit
                amet eros pretium venenatis nec non massa. Ut sed ligula purus.
                Praesent posuere orci vel ultrices efficitur. 
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
  