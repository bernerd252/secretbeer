$(document).ready(function(){
    
    var x = document.getElementById("demo");


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }


 var userLat  = position.coords.latitude 
  var userLng =   position.coords.longitude;
var userLatParse = parseFloat(userLat)
var userLngParse = parseFloat(userLng)
    
     $('select').material_select();
     $('.carousel').carousel();
  //carousel nexts and previous movement methods.
     /*$('.carousel.carousel-slider').carousel({full_width: true});*/

    // Next slide
  $('.carousel').carousel('next');
  $('.carousel').carousel('next', 3); // Move next n times.
  // Previous slide
  $('.carousel').carousel('prev');
  $('.carousel').carousel('prev', 4); // Move prev n times.
  // Set to nth slide
  $('.carousel').carousel('set', 4);
  //firebase data
   var config = {
    apiKey: "AIzaSyBTKzJTmrtTbwJeS_V4sryVrYfHS1gIpP4",
    authDomain: "beer-d9b34.firebaseapp.com",
    databaseURL: "https://beer-d9b34.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "773517315986"
  };
  // initialize firebase
  firebase.initializeApp(config);
  


  var database = firebase.database();
  console.log("database " + database)
 var where = "";
 var cityState = "";

 $(".cityStateInput").on("click", function(){
  cityState = (this.value)
  console.log("cityState " + cityState)
  $(".input-field").html('<nav><div class="nav-wrapper"><form><div class="input-field bycity"><input id="whereInput" type="search" required class="yellow"><label for="search"><i class="material-icons">search</i></label><i class="material-icons">close</i></div><button type="submit" class="btn waves-effect waves-light amber accent-4" id="clickButton">Submit</button><button type="submit" class="btn waves-effect waves-light amber accent-4" id="searchAgainButton"><a href = "index.html">Search Again?</a></button></form></div></nav>')
 



 // what happens when you click on the submit button
  $("#clickButton").on("click", function(){
   where = $("#whereInput").val().trim();
   var queryURL = "https://crossorigin.me/http://api.brewerydb.com/v2/locations/?key=9bebc0cee0d006506782667a99991706&" + cityState + "=" + where
   // console.log("where " + where)
   // console.log("cityState " + cityState)
  database.ref().push({
      where: where,
      cityState: cityState,
      queryURL: queryURL,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  return false;
  });

//   $("#searchAgainButton").on("click", function(){
//     $(".input-field").html('<button type="button" class="cityStateInput btn waves-effect waves-light amber accent-4" value = "locality">By City</button><button type="button" class="cityStateInput btn waves-effect waves-light amber accent-4" value = "region">ByState</button>')
//   })

// });
 database.ref().on("child_added", function(childSnapshot) {
  // console.log(childSnapshot.val().queryURL);
 
  var queryURL =    (childSnapshot.val().queryURL);
      var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      // console.log("ssss " + where)
      // console.log(queryURL)
 $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
       
      // console.log(response)
      
        
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: userLatParse, lng:userLngParse},
          zoom: 8,
          mapTypeControl: false
        });
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        
        var lats = [];
        var lngs = [];
        // console.log("length " + response.data.length)
        for (x=0;x<response.data.length;x++){
        var lat = response.data[x].latitude
        var lng = response.data[x].longitude
        var locations = [];
        
        lats.push(lat);
        lngs.push(lng);
        
      }
      // console.log(lats)
      // console.log(lngs)

     

        var largeInfowindow = new google.maps.InfoWindow();
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = ("https://raw.githubusercontent.com/bernerd252/secretbeer/master/images/beerBottle.gif")
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = ("https://raw.githubusercontent.com/bernerd252/secretbeer/master/images/beerBottleHover.png")
        var largeInfowindow = new google.maps.InfoWindow();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < lats.length; i++) {
          // Get the position from the location array. And turn them into something the computer can use.
          var latParse = parseFloat(lats[i])
          // console.log("latParse " + latParse)
          var lngParse = parseFloat(lngs[i])
          // console.log("lngParse " + lngParse)
          var title = response.data[i].brewery.name;
          // console.log(location)
          var description = response.data[i].brewery.description;
          // console.log("description" + description)
          var streetAddress = response.data[i].streetAddress
          // console.log("street " + streetAddress)
          var locality = response.data[i].locality
          var website = response.data[i].brewery.website;
         var label;

          if (response.data[i].brewery.images === undefined) {
            label = "https://smhttp-ssl-21049.nexcesscdn.net/media/catalog/product/cache/1/thumbnail/40x/9df78eab33525d08d6e5fb8d27136e95/s/p/spiegelau-beer-stein-glass-item-4991056.jpg"
            console.log("test")
          }
           else {
            var label = response.data[i].brewery.images.icon;
            console.log("tst2")}
          // console.log(label)
      
      // change latParse and lngParse into latitude and longitude cocordinates that google maps can understand
         var position = new google.maps.LatLng(latParse,lngParse);
          
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            streetAddress: streetAddress,
            locality: locality,
            website: website,
            description: description,
            label: label

            // streetAddress: streetAddress
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        
        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
        
      
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div><h5 id="popupHeader">' + marker.title + '</h5><br><b>' + marker.streetAddress + '</b><img src ="' + marker.label + '" class=icon></img><br><b>' + marker.locality + '</b><br>' + marker.description + '<br><b><a href=' + marker.website + ' target=blank>' + marker.website + '</a></b></div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }
      // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
    }
  });
// database.ref().on("child_added", function(childSnapshot) {
//   // console.log(childSnapshot.val().queryURL);
 
//   var queryURL =    (childSnapshot.val().queryURL);
  
//  $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
//  $('.carousel').empty();
//  var logos = [];
//  for (var j=0;j<response.data.length;j++){
//   var logo = response.data[j].brewery.images.squareMedium;
//   // console.log(response.data.length)
//   // console.log(logo)
//   logos.push(logo);
//  }
//  // console.log(logos)
//     // Loops through the array of logos
//     for (var i = 0; i < logos.length; i++){
//       // console.log("boom")
//       // Then dynamicaly generates buttons for each movie in the array

//       // Note the jQUery syntax here... 
//         var a = $('<a>') // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
//         a.addClass('carousel-item'); // Added a class 
//         a.attr('data-name', logos[i]); // Added a data-attribute
//         a.html('<img class="img" src="' + logos[i] + '">') // Provided the html
//         $('.carousel').append(a); // Added the button to the HTML
//         console.log("a " + a)
    
  });
});
});

