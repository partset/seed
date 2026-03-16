import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayPage from "./pages/PlayPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
