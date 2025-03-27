const Hero = () => {
    return (
      <div className="min-h-screen bg-[#1c1c1c] relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="w-full 
          sm:w-3/4
          md:w-2/3 
          lg:w-1/2
          z-10 
          mt-20 
          md:ml-4
          lg:ml-12
          xl:ml-20
          2xl:ml-8">
          <h1
        className="
          font-italiana
          text-[#Ecebe4]
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          leading-tight sm:leading-tight md:leading-tight
          mb-4 sm:mb-6 lg:mb-12
          max-w-full
        "
        style={{ fontFamily: "Italiana" }}
      >
        <span className="block sm:inline">Curated Subscription </span>
        <span className="block sm:inline">Boxes at Your </span>
        <span className="block">Doorstep</span>
      </h1>
            {/* <p className="text-[#Ecebe4] mb-8 text-lg lg:mb-12 font-item"
            style={{ fontFamily: "item" }}>
            Step into 'The Oud Lounge'—where every scent tells a story of luxury, tradition, and allure.
            Let our fragrances transport you to an oasis of sophistication, where the richness of oud meets modern elegance.
            </p> */}
   <a
      href="#"
      className="font-bold mt-4 sm:mt-6 md:mt-20 font-italiana inline-block border-2 border-white text-white 
                py-2 px-8 sm:py-3 sm:px-10 md:py-3 md:px-12 lg:py-4 lg:px-16
                rounded-full text-base sm:text-lg lg:text-xl font-medium 
                transition-all duration-300 ease-in-out 
                hover:bg-[#Ecebe4] hover:text-[#1c1c1c]"
      style={{ fontFamily: "Italiana" }}
    >
      Shop Our Boxes
    </a>

          </div>
          <div className="md:w-1/2 relative mt-12 md:mt-0">
            {/* Person image */}
            <div className="hidden md:block">
              <img src="https://via.placeholder.com/500x600" alt="Person in formal attire" className="relative z-10" />
            </div>
          </div>
        </div>
  
        {/* Dot pattern on the right */}
        <div className="absolute right-0 top-1/4 z-0">
          <div className="grid grid-cols-4 gap-4">
            {Array(16)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-white"></div>
              ))}
          </div>
        </div>
  
        {/* Additional dot pattern */}
        <div className="absolute right-1/4 bottom-1/4 z-0">
          <div className="grid grid-cols-4 gap-4">
            {Array(16)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-white"></div>
              ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default Hero
  
  