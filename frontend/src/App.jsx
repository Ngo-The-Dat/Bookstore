import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatBubble from "./components/ChatBubble";
import BookDetail from "./pages/BookDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import { CartProvider } from "./context/CartContext";


function App() {
  console.log("Current API URL:", import.meta.env.VITE_API_URL);
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBubble />
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
