import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Detail from './pages/Detail'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    new window.UICallWidget({ phoneNumber: '+34 600000000' })
  }, [])
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coches" element={<Listings />} />
        <Route path="/coches/:id" element={<Detail />} />
        <Route path="/motos" element={<Listings category="motos" />} />
        <Route path="/furgonetas" element={<Listings category="furgonetas" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
