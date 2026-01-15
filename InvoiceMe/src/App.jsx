import LoginPage from "./components/Landing/UserManagment/LoginPage"
import SignupPage from "./components/Landing/UserManagment/SignupPage"
import AddClient from "./components/app/GestionClient/AddClient"
import Dashboard from "./components/app/Dashboard"
import GenerateInvoice from "./components/app/GestionFacture/GenerateInvoice"
import {Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/add-client" element={<AddClient />} />
      </Routes>
   </div>
  )
}

export default App
