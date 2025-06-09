import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets.js'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/" className="sidebar-option">
          <img src={assets.home_icon} alt=""/>
          <p>Dashboard</p>
        </NavLink>
        <NavLink to="/addrecipe" className="sidebar-option">
        <img src={assets.add_icon} alt=""/>
          <p>Add Recipe</p>
        </NavLink>
        <NavLink to="/listrecipe" className="sidebar-option">
          <img src={assets.order_icon} alt=""/>
          <p>List Recipes</p>
        </NavLink>
        <NavLink to="/editrecipe" className="sidebar-option">
          <img src={assets.pencil_icon} alt=""/>
          <p>Edit Recipe</p>
        </NavLink>
        <NavLink to="/requestrecipe" className="sidebar-option">
          <img src={assets.request_icon} alt=""/>
          <p>Recipe Requests</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;