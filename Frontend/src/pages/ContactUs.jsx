import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "../components/header"
import Footer from "../components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactUs() {
  return (
<>
    <Header />

    <div className="min-h-screen bg-black text-white py-16">

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
           style={{ fontFamily: "'Itim', cursive" }}>
            Get in <span className="text-yellow-500">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto"
           style={{ fontFamily: "'Itim', cursive" }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-500"  style={{ fontFamily: "'Itim', cursive" }}>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 resize-none"
                    />
                  </div>

                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-6" style={{ fontFamily: "'Itim', cursive" }}>Contact Information</h3>
                <p className="text-gray-300 mb-8" style={{ fontFamily: "'Itim', cursive" }}>
                  Reach out to us through any of the following channels. We're here to help you discover the perfect
                  fragrance.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Visit Our Store</h4>
                        <p className="text-gray-300">
                          Greater London 
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500 p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Call Us</h4>
                        <p className="text-gray-300">
                         +44 7479411295 (WhatsApp only)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Email Us</h4>
                        <p className="text-gray-300">
                          Theoudlaunge@yahoo.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500 p-3 rounded-lg">
                        <Clock className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Business Hours</h4>
                        <p className="text-gray-300">
                          24/7 Available               
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
     {/* <section className="py-16 bg-gray-900">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold text-yellow-500 mb-4">Find Us</h3>
      <p className="text-gray-300">Visit our flagship store for a personalized fragrance experience</p>
    </div>

    <div className="bg-gray-800 rounded-lg overflow-hidden h-96">
      <iframe
        title="Store Location"
        className="w-full h-full border-0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9934.15777574198!2d0.0304945781728047!3d51.54908733682621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a7ebf62a0219%3A0x4c05d1e89f1e2113!2s731A%20Romford%20Rd%2C%20London%20E12%205AW%2C%20UK!5e0!3m2!1sen!2sus!4v1716571454765!5m2!1sen!2sus"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</section> */}



      <Footer />
    </div>
    
    </>
  )
}
