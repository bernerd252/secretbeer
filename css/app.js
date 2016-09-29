$(document).ready(function(){
    
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
	
  };
   var config = {
    apiKey: "AIzaSyBTKzJTmrtTbwJeS_V4sryVrYfHS1gIpP4",
    authDomain: "beer-d9b34.firebaseapp.com",
    databaseURL: "https://beer-d9b34.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "773517315986"
  // initialize firebase
  firebase.initializeApp(config);
  
   var database = firebase.database();
 var where = "";
 var cityState = "";

 // what happens when you click on the submit button
  $("#clickButton").on("click", function(){
   where = $("#whereInput").val().trim();
   cityState = $(".cityStateInput").val().trim();
   var queryURL = "https://crossorigin.me/http://api.brewerydb.com/v2/locations/?key=df96c11767682fe9178fde3cedaa19f3&" + cityState + "=" + where
   console.log("where " + where)
  database.ref().push({
      where: where,
      cityState: cityState,
      queryURL: queryURL,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  return false;
  });
// this need to return a brewery not a beer.... there doesn't seem to be a way to link a particular beer to a brewery....annoyingly
  //  $("#clickclickButton").on("click", function(){
  //  which = $("#whichInput").val().trim();
  // var queryURL = "https://crossorigin.me/http://api.brewerydb.com/v2/beers/?key=df96c11767682fe9178fde3cedaa19f3&name=" + which
  //  console.log(queryURL)
  //  $.ajax({url: queryURL, method: 'GET'}).done(function(response){
  //   var id = response.data[0].id;
  //   console.log(id)
  //   var queryURL = "https://crossorigin.me/http://api.brewerydb.com/v2/breweries/?key=df96c11767682fe9178fde3cedaa19f3&" + id
  //  });
  // database.ref().push({
  //     which: which,
  //     queryURL: queryURL,
  //     dateAdded: firebase.database.ServerValue.TIMESTAMP
  //   });
  // return false;
  // });


 database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val().queryURL);
 
  var queryURL = (childSnapshot.val().queryURL);
      var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      console.log("ssss " + where)
      console.log(queryURL)
 $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
       
      console.log(response)
      
       
     
        // Create a styles array to use with the map.
        
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13,
          mapTypeControl: false
        });
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        var lats = [];
        var lngs = [];
        console.log(response.data.length)
        for (x=0;x<response.data.length;x++){
        var lat = response.data[x].latitude
        var lng = response.data[x].longitude
        var locations = [];
        lats.push(lat);
        lngs.push(lng);
      }
      console.log(lats)
      console.log(lngs)
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
          console.log("latParse " + latParse)
          var lngParse = parseFloat(lngs[i])
          console.log("lngParse " + lngParse)
          var title = response.data[i].brewery.name;
          console.log(location)
          var description = response.data[i].brewery.description;
          console.log("description" + description)
          var streetAddress = response.data[i].streetAddress
          console.log("street " + streetAddress)
          var locality = response.data[i].locality
          var website = response.data[i].brewery.website;
          var label = response.data[i].brewery.images.icon;
          console.log(label)
      
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
});
      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      // function makeMarkerIcon(markerColor) {
      //   var markerImage = new google.maps.MarkerImage(
      //     'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      //     '|40|_|%E2%80%A2',
      //     new google.maps.Size(21, 34),
      //     new google.maps.Point(0, 0),
      //     new google.maps.Point(10, 34),
      //     new google.maps.Size(21,34));
      //   return markerImage;
      // }
  //  

//
	



        
        });