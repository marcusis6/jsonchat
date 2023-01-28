<!DOCTYPE html>
<html>
  <head>
    <title>Chat Room</title>

    <link rel="stylesheet" type="text/css" href="../bootstrap.min.css" />

    <link rel="stylesheet" href="../all.css" />
    <!--  <link rel="stylesheet" type="text/css" href="../all.css" /> -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="../jquery.min.js"></script>
    <script src="../popper.min.js"></script>
    <script src="../bootstrap.min.js"></script>
    <script src="../socket.io.js"></script>

    <script src="../moment.js"></script>
    <script src="../moment-timezone-with-data-2012-2022.min.js"></script>
    <script src="../bn.js"></script>
    <script>
      function createAlert(
        title,
        summary,
        details,
        severity,
        dismissible,
        autoDismiss,
        appendToId
      ) {
        var iconMap = {
          info: "fa fa-info-circle",
          success: "fa fa-thumbs-up",
          warning: "fa fa-exclamation-triangle",
          danger: "fa ffa fa-exclamation-circle",
        };

        var iconAdded = false;

        var alertClasses = ["alert", "animated", "flipInX"];
        alertClasses.push("alert-" + severity.toLowerCase());

        if (dismissible) {
          alertClasses.push("alert-dismissible");
        }

        var msgIcon = $("<i />", {
          class: iconMap[severity], // you need to quote "class" since it's a reserved keyword
        });

        var msg = $("<div />", {
          class: alertClasses.join(" "), // you need to quote "class" since it's a reserved keyword
        });

        if (title) {
          var msgTitle = $("<h4 />", {
            html: title,
          }).appendTo(msg);

          if (!iconAdded) {
            msgTitle.prepend(msgIcon);
            iconAdded = true;
          }
        }

        if (summary) {
          var msgSummary = $("<strong />", {
            html: summary,
          }).appendTo(msg);

          if (!iconAdded) {
            msgSummary.prepend(msgIcon);
            iconAdded = true;
          }
        }

        if (details) {
          var msgDetails = $("<p />", {
            html: details,
          }).appendTo(msg);

          if (!iconAdded) {
            msgDetails.prepend(msgIcon);
            iconAdded = true;
          }
        }

        if (dismissible) {
          var msgClose = $("<span />", {
            class: "close", // you need to quote "class" since it's a reserved keyword
            "data-dismiss": "alert",
            html: "<i class='fa fa-times-circle'></i>",
          }).appendTo(msg);
        }

        $("#" + appendToId).prepend(msg);

        if (autoDismiss) {
          setTimeout(function () {
            msg.addClass("flipOutX");
            setTimeout(function () {
              msg.remove();
            }, 1000);
          }, 5000);
        }
      }
    </script>
  </head>

  <body>
    <%- body %>
  </body>

  <script>
    var sound = true;
    var disconnected = new Audio("/disconnected.wav");
    var connected = new Audio("/connected.wav");
    var notification = new Audio("/notification.wav");
    var hajiraInterval = 30000; // every 10sec client will send hajira
    var $user_id = $("#usrId").html();
  </script>
  <style>
    body {
      font-size: 1.2rem;
      background-color: #f8f9fa;
    }

    .feather {
      width: 16px;
      height: 16px;
      vertical-align: text-bottom;
    }

    .message-box {
      overflow-y: auto;
    }

    /*
* Sidebar
*/

    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 100; /* Behind the navbar */
      padding: 48px 0 0; /* Height of navbar */
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }

    .main-section {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 100; /* Behind the navbar */
      padding: 48px 0 0; /* Height of navbar */
      box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 767.98px) {
      .sidebar {
        top: 3rem;
      }
      .main-section {
        top: 3rem;
      }
      #sidebar-toggle {
        display: none;
      }
    }

    @media (max-width: 575px) {
      .sidebar {
        top: 4rem;
      }
      .main-section {
        top: 4rem;
      }
    }

    @media (max-width: 428px) {
      .sidebar {
        top: 7rem;
      }
      .main-section {
        top: 7rem;
      }
    }

    @media (max-width: 418px) {
      .sidebar {
        top: 6.5rem;
      }
      .main-section {
        top: 6.5rem;
      }
      .noticeSection {
        max-width: 100% !important;
      }
    }

    @media (max-width: 247px) {
      .sidebar {
        top: 10rem;
      }
      .main-section {
        top: 10rem;
      }
    }

    .sidebar-sticky {
      position: relative;
      top: 0;
      height: calc(100vh - 48px);
      padding-top: 0.5rem;
      overflow-x: hidden;
      overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    }

    @supports ((position: -webkit-sticky) or (position: sticky)) {
      .sidebar-sticky {
        position: -webkit-sticky;
        position: sticky;
      }
    }

    .sidebar .nav-link {
      font-weight: 500;
      color: #333;
    }

    .sidebar .nav-link .feather {
      margin-right: 4px;
      color: #999;
    }

    .sidebar .nav-link.active {
      color: #007bff;
    }

    .sidebar .nav-link:hover .feather,
    .sidebar .nav-link.active .feather {
      color: inherit;
    }

    .sidebar-heading {
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    /*
* Navbar
*/

    .navbar-brand {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      font-size: 1rem;
      background-color: rgba(0, 0, 0, 0.25);
      box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
    }

    .navbar .navbar-toggler {
      top: 0.25rem;
      right: 1rem;
    }

    .navbar .form-control {
      padding: 0.75rem 1rem;
      border-width: 0;
      border-radius: 0;
    }

    .chat-body1 p {
      background: #fbf9fa none repeat scroll 0 0;
      padding: 6px;
      word-break: break-all;
    }

    #jump-to-last {
      position: absolute;
      bottom: 210px;
      right: 90px;
      background: #000;
      background: rgba(0, 0, 0, 0.7);
      width: 50px;
      height: 50px;
      display: block;
      text-decoration: none;
      -webkit-border-radius: 35px;
      -moz-border-radius: 35px;
      border-radius: 35px;
      display: none;
      -webkit-transition: all 0.3s linear;
      -moz-transition: all 0.3s ease;
      -ms-transition: all 0.3s ease;
      -o-transition: all 0.3s ease;
      transition: all 0.3s ease;
    }

    #jump-to-last i {
      color: #fff;
      margin: 0;
      position: relative;
      left: 16px;
      top: 13px;
      font-size: 19px;
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
      -ms-transition: all 0.3s ease;
      -o-transition: all 0.3s ease;
      transition: all 0.3s ease;
    }

    #jump-to-last:hover {
      background: rgba(0, 0, 0, 0.9);
    }

    #jump-to-last:hover i {
      color: #fff;
      top: 5px;
    }

    ul#chat li.pending {
      color: #aaa;
    }

    a#loadmore {
      position: absolute;
      display: block;
      display: none;
    }

    a:hover {
      text-decoration: none;
    }

    .text-muted {
      float: right;
    }

    .wrapper {
      z-index: 100;
    }

    .header_sec {
      text-align: center;
    }

    .left-arrow {
      position: absolute;
      top: 9%;
      left: 98%;
      bottom: 0;
      right: 0;
      margin: auto;
      font-size: 23px;
      color: #28a745;
      z-index: 10000;
    }

    /* sidebar hider icon related css */
    #sidebar-toggle {
      width: 28px;
      height: 32px;
      cursor: pointer;
      position: fixed;
      z-index: 100000;
      right: 1%;
      top: 7.5%;
    }

    #header-toggle {
      width: 28px;
      height: 32px;
      cursor: pointer;
      position: fixed;
      z-index: 100000;
      left: 0.55%;
      top: 1%;
    }

    .burger:before,
    .burger span,
    .burger:after {
      width: 100%;
      height: 2px;
      display: block;
      background: #000;
      border-radius: 2px;
      position: absolute;
      opacity: 1;
    }

    .burger:before,
    .burger:after {
      -webkit-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1),
        -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
      transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1),
        -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
      -o-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
      transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
      transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1),
        -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
      -webkit-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
      content: "";
    }

    .burger:before {
      top: 4px;
    }

    .burger span {
      top: 15px;
    }

    .burger:after {
      top: 26px;
    }

    /* Hover */
    .burger:hover:before {
      top: 7px;
    }

    .burger:hover:after {
      top: 23px;
    }

    /* Click */
    .burger.active span {
      opacity: 0;
    }

    .burger.active:before,
    .burger.active:after {
      top: 40%;
    }

    .burger.active:before {
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=5);
      /*for IE*/
    }

    .burger.active:after {
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=-5);
      /*for IE*/
    }

    .burger:focus {
      outline: none;
    }

    /* alert related css  */
    #pageMessages {
      position: fixed;
      bottom: 15px;
      right: 15px;
      width: 30%;
      z-index: 20000;
    }

    .alert {
      position: relative;
    }

    .alert .close {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 1em;
    }

    .alert .fa {
      margin-right: 0.3em;
    }

    /* sound-control related  */
    .sound-control {
      font-size: 23px;
      color: #28a745;
    }
  </style>
</html>
