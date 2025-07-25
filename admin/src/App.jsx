import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import ListRecipe from './pages/ListRecipe/ListRecipe';
import EditRecipe from './pages/EditRecipe/EditRecipe';
import RequestRecipe from './pages/RequestRecipe/RequestRecipe';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  
  return (
  <div>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className="app-content">
          <Sidebar />
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/addrecipe" element={<AddRecipe />} />
            <Route path="/listrecipe" element={<ListRecipe />} />
            <Route path="/editrecipe" element={<EditRecipe />} />
            <Route path="/requestrecipe" element={<RequestRecipe />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
