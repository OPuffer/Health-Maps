// @ts-nocheck TODO remove when fixed

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: {  lat: 37.76347, lng: -122.44308 },
      zoom: 12,
      mapTypeId: "roadmap",
    }
  );

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    const infowindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);

    if (places.length == 0) {
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

      service.getDetails(request, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          google.maps.event.addListener(marker, "click", () => {
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
          });
        } else {
          google.maps.event.addListener(marker, "click", () => {
            const content = document.createElement("div");
    
            const nameElement = document.createElement("h2");
    
            nameElement.textContent = "An Error Occured";
            content.appendChild(nameElement);
    
            const placeIdElement = document.createElement("p");
    
            placeIdElement.textContent = "Status is: " + status;
            content.appendChild(placeIdElement);
    
            const placeAddressElement = document.createElement("p");
    
            placeAddressElement.textContent = "so you saw this instead!";
            content.appendChild(placeAddressElement);
    
            infowindow.setContent(content);
            infowindow.open(map, marker);
          });
        }
      });


    });

    map.fitBounds(bounds);
  });
}

declare global {
  interface Window {
    initAutocomplete: () => void;
  }
}
window.initAutocomplete = initAutocomplete;
export {};