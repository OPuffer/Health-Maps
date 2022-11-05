// Initialize and add the map
function initMap() {
    console.log("hi");
    // The location of Uluru
    const SF = { lat: 37.77, lng: -122.419};
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: SF,
    });
    // The marker, positioned at Uluru
    // const marker = new google.maps.Marker({
    //   position: SF,
    //   map: map,
    // });
  }
  
  window.initMap = initMap;