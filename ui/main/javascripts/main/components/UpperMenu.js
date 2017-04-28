import React from "react"

export const UpperMenu = () => {
  return (
    <div className="top-nav">
      <a id="menu_toggle">
        <i className="fa fa-bars fa-3x"></i>
      </a>
      <div className="user">
        <img src="/assets/images/user_profile.png" alt="profile pic" className="img-circle profile-img" />
        <span className="profile-text">Marcos Núñez</span>
      </div>
    </div>
  )
}