import React from 'react';
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';


let healthData = require('./data.json');
const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
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
        <div id = "filters">
          <Checkbox/>
        </div>
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

let map: google.maps.Map; 
let infowindow: google.maps.InfoWindow;
let service: google.maps.places.PlacesService;
let places: google.maps.places.PlaceResult[];
let markers: google.maps.Marker[] = [];
let bounds: google.maps.LatLngBounds;
let searchBox: google.maps.places.SearchBox;

function mapLogic(){
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
  const input = document.getElementById("pac-input") as HTMLInputElement;
  searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  searchBox.addListener("places_changed", () => {
    filterResults();
  });
}

function clickBox(request: google.maps.places.PlaceDetailsRequest, marker:google.maps.Marker){
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
       

        infowindow.setContent(content);
        infowindow.open(map, marker);
      }
  });
}

function filterResults() {
  places = searchBox.getPlaces()!;
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  if (places === undefined) {
    return;
  }

  // Clear out the old markers.
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  bounds = new google.maps.LatLngBounds();

  places.forEach((place) => {
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    if(place.place_id === undefined){
      console.log("Returned place contains no ID");
      return;
    }
    
    if(!checkedP && !checkedT && !checkedS) {
      console.log("All good case");
    }else if (healthData[place.place_id!] === undefined){
      return;
    } else if (checkedP && healthData[place.place_id!]["p"] === true){
      console.log("P only");
    } else if(checkedT && healthData[place.place_id!]["t"] === true){
      console.log("T only");
    } else if (checkedS && healthData[place.place_id!]["s"] === true){
      console.log("S only");
    } else {
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
      clickBox(request, marker);
    });
  });

  map.fitBounds(bounds);
}

let checkedP: boolean;
let checkedS: boolean; 
let checkedT: boolean; 

function Checkbox() { 
  checkedP = false;
  checkedS = false; 
  checkedT = false; 
  
  const handleChangeP = () => {  
    checkedP = !checkedP;
    console.log("input " + checkedP + " " + checkedS + " " + checkedT);
    filterResults();  
  }; 
  const handleChangeS = () => { 
    checkedS = !checkedS; 
    console.log("input " + checkedP + " " + checkedS + " " + checkedT);
    filterResults();
  }; 
  const handleChangeT = () => {  
    checkedT = !checkedT;
    console.log("input " + checkedP + " " + checkedS + " " + checkedT);
    filterResults();
  }; 

  return ( 
      <div>
          <input type="checkbox" id="pregnancyWard" name="pregnancyWard" value="P" onChange={handleChangeP}></input>
          <label htmlFor="pregnancyWard">Pregnancy Ward</label>
          <input type="checkbox" id="strokeCenter" name="strokeCenter" value="S" onChange={handleChangeS}></input>
          <label htmlFor="strokeCenter">Stroke Center</label>
          <input type="checkbox" id="traumaCenter" name="traumaCenter" value="T" onChange={handleChangeT}></input>
          <label htmlFor="traumaCenter">Trauma Center</label>
      </div> 
  ); 
  
}; 

export default App;
