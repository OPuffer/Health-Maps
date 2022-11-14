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
        <div id = "filters">
          {/* <input type="checkbox" id="pregnancyWard" name="pregnancyWard" value="P"></input>
          <label htmlFor="pregnancyWard">Pregnancy Ward</label>
          <input type="checkbox" id="strokeCenter" name="strokeCenter" value="S"></input>
          <label htmlFor="strokeCenter">Stroke Center</label>
          <input type="checkbox" id="traumaCenter" name="traumaCenter" value="T"></input>
          <label htmlFor="traumaCenter">Trauma Center</label> */}
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

function mapLogic(){
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  searchBox.addListener("places_changed", () => {
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
        console.log("Else Case!");
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
                const pregnancySupport = document.createElement("div");
                pregnancySupport.textContent = "Supports Pregnancy? : " + healthData[place.place_id!]["p"];
                content.appendChild(pregnancySupport);

                const traumaSupport = document.createElement("div");
                traumaSupport.textContent = "Trauma Center? : " + healthData[place.place_id!]["p"];
                content.appendChild(traumaSupport);

                const strokeSupport = document.createElement("div");
                strokeSupport.textContent = "Stroke Center? : " + healthData[place.place_id!]["p"];
                content.appendChild(strokeSupport);
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

function filterResults() {
  
  if (places === undefined) {
    return;
  }
  // Clear out the old markers.
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
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
      console.log("Else Case!");
      return;
    }

    // Create a marker for each place.
    const marker : google.maps.Marker = new google.maps.Marker({
      map,
      title: place.name,
      position: place.geometry.location,
    }); 

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
              const pregnancySupport = document.createElement("div");
              pregnancySupport.textContent = "Supports Pregnancy? : " + healthData[place.place_id!]["p"];
              content.appendChild(pregnancySupport);

              const traumaSupport = document.createElement("div");
              traumaSupport.textContent = "Trauma Center? : " + healthData[place.place_id!]["p"];
              content.appendChild(traumaSupport);

              const strokeSupport = document.createElement("div");
              strokeSupport.textContent = "Stroke Center? : " + healthData[place.place_id!]["p"];
              content.appendChild(strokeSupport);
            }
    
            infowindow.setContent(content);
            infowindow.open(map, marker);
          }
      });
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
