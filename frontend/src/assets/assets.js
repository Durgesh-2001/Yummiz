import basket_icon from './basket_icon.png'
import logo from './logo.png'
import search_icon from './search_icon.png'
import bell_icon from './bell_icon.png'
import sun_icon from './sun_icon.png'
import moon_icon from './moon_icon.png'

import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'

import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import instagram_icon from './instagram_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'


export const assets = {
    logo,
    basket_icon,
    bell_icon,
    search_icon,
    app_store,
    play_store,
    linkedin_icon,
    instagram_icon,
    twitter_icon,
    cross_icon,
    sun_icon,
    moon_icon
}

export const url = import.meta.env.VITE_BACKEND_URL

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls & Wraps",
        menu_image: menu_2
    },
    {
        menu_name: "Pastry & Desserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Veg",
        menu_image: menu_5
    },
    {
        menu_name: "Non-Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta & Noodles",
        menu_image: menu_7
    }
]