import Header from "../components/header"
import Hero from "../components/hero"
import Section1 from "../components/Section1"
import Section2 from "../components/Section2"
import Section3 from "../components/Section3"
import Footer from "../components/Footer"

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Section1 />
            <Section2 />
            <Section3 />
            <Footer />
            {/* Your other components can go here */}
        </>
    )
}