import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
