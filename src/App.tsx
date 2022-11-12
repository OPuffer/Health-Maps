import React from 'react';
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';

let healthData = require('./data.json');

const loader = new Loader({
  apiKey: "AIzaSyBM_S0v7LZfdS3RD5t1xtftyqqbFthhQL4",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {  lat: 37.76347, lng: -122.44308 },
  zoom: 12,
  mapTypeId: "roadmap",
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Welcome to Health Maps</h3>
        <input id="pac-input" className="controls" type="text" placeholder="Search Box"></input>
        <div id = "map"></div>
        
      </header>
    </div>
  );
}

loader.loadCallback(e => {
  if (e) {
    console.log(e);
  } else {
    mapLogic();
  }
});

function mapLogic(){
  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    const infowindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);

    if (places === undefined) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      if(place.place_id === undefined){
        console.log("Returned place contains no ID");
        return;
      }

      // Create a marker for each place.
      const marker : google.maps.Marker = new google.maps.Marker({
        map,
        title: place.name,
        position: place.geometry.location,
      }) 

      markers.push(marker);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      const request = {
        placeId : place.place_id,
      };

      google.maps.event.addListener(marker, "click", () => {
        service.getDetails(request, (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
              const content = document.createElement("div");
      
              const nameElement = document.createElement("h2");
      
              nameElement.textContent = place.name!;
              content.appendChild(nameElement);
      
              const placeIdElement = document.createElement("p");
      
              placeIdElement.textContent = place.place_id!;
              content.appendChild(placeIdElement);
      
              const placeAddressElement = document.createElement("p");
      
              placeAddressElement.textContent = place.formatted_address!;
              content.appendChild(placeAddressElement);
              if(healthData[place.place_id!]){
                const supported_emergency = document.createElement("div");
                supported_emergency.textContent = healthData[place.place_id!]["test"];
                content.appendChild(supported_emergency);
              }
      
              infowindow.setContent(content);
              infowindow.open(map, marker);
            }
        });
      });
    });

    map.fitBounds(bounds);
  });
}

export default App;
