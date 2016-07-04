"use strict";

$(document).ready(function () {
   $(".swipe").html("<div class='test'><h1>swipe</h1></div>");
   $(".test").width("100%");
   $(".test").height($(window).innerHeight());
   $(".test").css({ position: "fixed" });

   var script = document.createElement('script');
   script.src = './hirano.js';
   document.body.appendChild(script);
});

function callback(data) {
   var default_page = 0;

   if (location.hash) {
      default_page = Number(location.hash.substr(1));
   }

   var swipe_loader = new SwipeLoader(data, default_page);

   $(".swipe").on("click", function () {
      swipe_loader.next();
   });

   $(window).on('hashchange', function () {
      if ("#" + swipe_loader.getStep() != location.hash) {
         swipe_loader.show(Number(location.hash.substr(1)));
      }
   });

   $(window).resize(function () {
      clearTimeout(window.resizedFinished);
      window.resizedFinished = setTimeout(function () {
         swipe_loader.resize();
      }, 250);
   });
};