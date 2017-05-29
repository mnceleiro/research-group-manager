import React from "react"

export const SidebarMenu = (data) => {
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
            <h2>{data.user.name}</h2>
          </div>
        </div>

        <br />

        <div>

          <div className="rgm-menu-section-title">
            <h3>General</h3>
          </div>
          <div className="rgm-menu-section">
            <ul className="nav side-menu">
              <li className="active"><a href="/"><i className="fa fa-calendar fa-2x"></i>Calendario</a></li>
              <li><a href="/researchers"><i className="fa fa-users fa-2x"></i>Investigadores</a></li>
              <li><a href="/authors"><i className="fa fa-users fa-2x"></i>Autores</a></li>
              <li><a href="/projects"><i className="fa fa-home fa-2x"></i>Proyectos</a></li>
            </ul>
          </div>

          <div className="rgm-menu-section-title">
            <h3>Publicaciones</h3>
          </div>
          <div className="rgm-menu-section">
            <ul className="nav side-menu">
              <li><a href="/books"><i className="fa fa-book fa-2x"></i>Libros</a></li>
              <li><a href="/congresses"><i className="fa fa-briefcase fa-2x"></i> Congresos</a></li>
            </ul>
          </div>

        </div>
      </nav>
    </div>
  )
}
