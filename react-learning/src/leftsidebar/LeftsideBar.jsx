import React from 'react'
import "./leftsidebar.css"
import assets from '../assets/assets'

const LefsideBar = () => {
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo}  className="logo" alt="" />
            <div className="menu">
                <img src={assets.menu_icon} alt="" />
            </div>
        </div>

        <div className="search-icon">
            <img src={assets.search_icon} alt="" />
            <input type="text" placeholder='Search here' />
        </div>
      </div>
      
      <div className="ls-list">
        <div className="profile">
            <img src={assets.avatar_icon} alt="" />
          <div className="usrName">Vijay</div>
        </div>
      </div>

    </div>
  )
}

export default LefsideBar
