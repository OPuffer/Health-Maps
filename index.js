// Initialize and add the map
function initMap() {
    console.log("hi");
    // The location of Uluru
    const SF = { lat: 37.7749, lng: -122.4194};
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: SF,
    });
    // The marker, positioned at Uluru
    // const marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map,
    // });
  }
  
  window.initMap = initMap;