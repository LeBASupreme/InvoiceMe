import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/Landing/UserManagment/LoginPage"
import SignupPage from "./components/Landing/UserManagment/SignupPage"
import AddClient from "./components/app/GestionClient/AddClient"
import LandingPage from "./components/Landing/LandingPage"
import ModifierClient from "./components/app/GestionClient/ModifierClient"
import NotFound from "./components/404"
import Unauthorized from "./components/401"

import Dashboard from "./components/app/Dashboard"
import GenerateInvoice from "./components/app/GestionFacture/GenerateInvoice"

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-white text-xl">Chargement...</span>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/landing" replace />
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route path="/dashboard/generateInvoice" element={<GenerateInvoice />} />
        <Route path="/modifier-client/:id" element={<ModifierClient />} />
        <Route path="/401" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
   </div>
  )
}

export default App
