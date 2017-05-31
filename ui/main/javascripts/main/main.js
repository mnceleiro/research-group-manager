import $ from "jquery"

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
