
export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 bg-gray-850 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-gray-600 bg-clip-text text-transparent"  style={{ fontFamily: "Italiana" }}>
            Why Choose us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className=" h-full mt-20 bg-gradient-to-br from-amber-50 to-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center">
            <div className="mb-4 text-xl font-semibold bg-gradient-to-r from-amber-500 to-gray-400 bg-clip-text text-transparent">
              01
            </div>
            <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-amber-100 to-gray-200 rounded-full p-5">
              <img
                src="/Images/perfume-icon.png" 
                alt="Premium Scents"
                className="w-[60px] h-[60px] object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-gray-600 bg-clip-text text-transparent">
              Premium Scents
            </h3>
            <p className="text-center text-gray-700 text-sm"  style={{ fontFamily: "'item' " }}>
              Experience the essence of luxury with our premium scents, crafted from high-quality natural ingredients
            </p>
          </div>

          {/* Feature 2 */}
          <div className=" h-full mt-20 bg-gradient-to-br from-amber-50 to-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center">
            <div className="mb-4 text-xl font-semibold bg-gradient-to-r from-amber-500 to-gray-400 bg-clip-text text-transparent">
              02
            </div>
            <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-amber-100 to-gray-200 rounded-full p-5">
              <img
                src="/Images/delivery-icon.png"
                alt="Fast Delivery"
                className="w-[60px] h-[60px] object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-gray-600 bg-clip-text text-transparent">
              Fast Delivery
            </h3>
            <p className="text-center text-gray-700 text-sm"  style={{ fontFamily: "'item' " }}>
              With our fast delivery service, your subscription box arrives right on time, ensuring you never run out of
              your favorite fragrances
            </p>
          </div>

          {/* Feature 3 */}
          <div className="h-full mt-20 bg-gradient-to-br from-amber-50 to-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center">
            <div className="mb-4 text-xl font-semibold bg-gradient-to-r from-amber-500 to-gray-400 bg-clip-text text-transparent">
              03
            </div>
            <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-amber-100 to-gray-200 rounded-full p-5">
              <img
                src="/Images/diamond-icon.png"
                alt="Exclusive Offers"
                className="w-[60px] h-[60px] object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-gray-600 bg-clip-text text-transparent">
              Exclusive Offers
            </h3>
            <p className="text-center text-gray-700 text-sm" style={{ fontFamily: "'item' " }}>
              Enjoy exclusive offers and special discounts as a valued member
            </p>
          </div>
        </div>

        <div className="mt-40 text-center">
          <a
            href="/product"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-amber-600 to-gray-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Explore Our Products
          </a>
        </div>
      </div>
    </section>
  )
}
