import React from "react"

export const UpperMenu = (data) => {
  return (
    <div className="top-nav">
      <a id="menu_toggle">
        <i className="fa fa-bars fa-3x"></i>
      </a>
      <div className="user" onClick={data.logout}>
        <i className="fa fa-sign-out fa-2x"></i><span className="profile-text">Salir</span>
      </div>
      <div className="user">
        <img src="/assets/images/user_profile.png" alt="profile pic" className="img-circle profile-img" />
        <span className="profile-text">{data.user.name}</span>
      </div>
    </div>
  )
}
