import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Landing from './Pages/Client-side/Landing'
import Login from './Pages/Login'

function App() {
  return (  
    <Router>
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router> 
);
  
};

export default App
