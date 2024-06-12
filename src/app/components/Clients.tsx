const clients = [
    {
      id: "client-1",
      logo:"/google.png",
    },
    {
      id: "client-2",
      logo: "/slack.png",
    },
    {
      id: "client-3",
      logo: "/atlassian.png",
    },
    {
      id: "client-4",
      logo: "/dropbox.png",
    },
    {
      id: "client-5",
      logo: "/shopify.png",
    },
  ];

const Clients = () => (
    <section
    style={{
      background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
    }}
    className="flex justify-center items-center w-[85%]  sm:my-16 my-6  px-6 sm:py-12 py-4 sm:flex-row flex-col rounded-[20px] box-shadow">
    <div className="flex justify-center items-center flex-wrap w-full">
      {clients.map((client) => (
        <div key={client.id} className=" flex justify-center items-center sm:min-w-[172px] min-w-[120px] my-5 mx-3">
          <img src={client.logo} alt="client_logo" className="sm:w-[172px] w-[100px] object-contain" />
        </div>
      ))}
    </div>
  </section>
);

export default Clients;
