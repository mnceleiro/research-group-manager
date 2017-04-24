import $ from "jquery"
//var CURRENT_URL = window.location.href.split("#")[0].split("?")[0],
//    $BODY = $("body"),
//    $MENU_TOGGLE = $("#menu_toggle"),
//    $SIDEBAR_MENU = $("#menu"),
//    $SIDEBAR_FOOTER = $(".sidebar-footer"),
//    $LEFT_COL = $(".left_col"),
//    $RIGHT_COL = $(".right_col"),
//    $NAV_MENU = $(".nav_menu"),
//    $FOOTER = $("footer")
//
//$(document).ready(function() {
//	var setContentHeight = function () {
//        // reset height
//		var winHeight = $(window).height()
//        $RIGHT_COL.css("min-height", winHeight)
//
//        var bodyHeight = $BODY.outerHeight(),
//            footerHeight = $BODY.hasClass("footer_fixed") ? -10 : $FOOTER.height(),
//            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
//            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight
//
//        // normalize content
//        contentHeight -= $NAV_MENU.height() + footerHeight
//
//        $RIGHT_COL.css("min-height", contentHeight)
//    }
//
//    setContentHeight()
//
//    // toggle small or large menu
//    $MENU_TOGGLE.on("click", function() {
//    	debugger
//        if ($BODY.hasClass("nav-md")) {
//            $SIDEBAR_MENU.find("li.active ul").hide()
//            $SIDEBAR_MENU.find("li.active").addClass("active-sm").removeClass("active")
//        } else {
//            $SIDEBAR_MENU.find("li.active-sm ul").show()
//            $SIDEBAR_MENU.find("li.active-sm").addClass("active").removeClass("active-sm")
//        }
//
//        $BODY.toggleClass("nav-md nav-sm")
//
//        setContentHeight()
//    })
//})

$(document).ready(function() {
  var $MENU_TOGGLE = $("#menu_toggle")
  var $BODY = $("body")
  var $CONTENT_COLUMN = $(".content-column")
  var $PROFILE = $(".rgm-profile-section")
  var $SECTION_TITLE = $(".rgm-menu-section-title")

  $MENU_TOGGLE.on("click", function() {
    $CONTENT_COLUMN.css("min-height", $(window).height())
    // Expand/collapse sidebar
    if ($BODY.hasClass("nav-md")) {
      // Contraer
      $BODY.removeClass("nav-md")
      $BODY.addClass("nav-sm")
      $PROFILE.hide()
      $SECTION_TITLE.hide()

    } else {
      // Expandir
      $BODY.removeClass("nav-sm")
      $BODY.addClass("nav-md")
      $PROFILE.show()
      $SECTION_TITLE.show()
    }
  })
})
