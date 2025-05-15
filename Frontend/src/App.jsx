import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Product from "./pages/Products";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
function App() {
  return (
   
      <BrowserRouter basename="/The_oud_lounge">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/login" element={<Login />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;
