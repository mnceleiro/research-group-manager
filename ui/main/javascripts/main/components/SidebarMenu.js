import React from "react"

export const SidebarMenu = () => {
  return (
    <div id="menu" className="col-md-2">
      <nav role="navigation">
        <div className="navbar nav_title">
          <a href="/" className="site-title"><i className="fa fa-group fa-3x icon-circle"></i> <span className="page-sidebar-title">RGM</span></a>
        </div>

        <div className="clearfix"></div>

        <div className="row rgm-profile-section">
          <div className="col-md-4 profile_pic">
            <img src="/assets/images/user_profile.png" alt="profile pic" className="img-circle profile-img"></img>
          </div>
          <div className="col-md-8 profile_info">
            <a><span>Bienvenido,</span></a>
            <h2>Marcos Núñez</h2>
          </div>
        </div>

        <br />

        <div>
          <div className="rgm-menu-section-title col-md-12">
            <h3>General</h3>
          </div>
          <div className="rgm-menu-section">
            <ul className="nav side-menu">
              <li className="active"><a><i className="fa fa-home fa-2x"></i>Dashboard</a></li>
              <li><a href="/researchers"><i className="fa fa-users fa-2x"></i>Investigadores</a></li>
              <li><a><i className="fa fa-calendar fa-2x"></i>Calendario</a></li>
            </ul>
          </div>
          <div className="rgm-menu-section-title">
            <h3>Publicaciones</h3>
          </div>
          <div className="rgm-menu-section">
            <ul className="nav side-menu">
              <li><a><i className="fa fa-book fa-2x"></i>Revistas</a></li>
              <li><a><i className="fa fa-briefcase fa-2x"></i> Congresos</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}