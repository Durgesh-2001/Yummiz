import React from 'react'
import './ExploreDishes.css'
import { menu_list } from '../../assets/assets'

const ExploreDishes = ({category,setCategory}) => {
  return (
    <div className='explore-dishes' id='explore-dishes'>
      <h1>Explore Menu</h1>
      <p className='explore-dishes-text'>Explore our menu and find your favourite dish!</p>
      <div className='explore-dishes-list'>
        {menu_list.map((item, index) => {
          return (
            <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-dishes-item'>
              <img className={category===item.menu_name?"active":""} src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreDishes