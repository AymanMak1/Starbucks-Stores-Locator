var map;
var markers = [];
var infoWindow;
function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    // center: { lat: 34.020882, lng: -6.84165 },
    center: losAngeles,
    zoom: 8,
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [
          {
            invert_lightness: true,
          },
          {
            saturation: 10,
          },
          {
            lightness: 30,
          },
          {
            gamma: 0.5,
          },
          {
            hue: "#435158",
          },
        ],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();
  searchStores();
  //displayStores();
  showStoresMarkers();
  setOnClickListener();
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    stores.forEach(function (store) {
      var postal = store.address.postalCode.substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    });
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function displayStores(stores) {
  var storesHtml = "";
  stores.forEach(function (store, index) {
    var address = store.addressLines;
    var phone = store.phoneNumber;
    storesHtml += `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index + 1}
                    </div>
                </div>
            </div>
        `;
  });
  document.querySelector(".stores-list").innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    //console.log(latlng);
    var name = store.name;
    var address = store.addressLines[0];
    var statusText = store.openStatusText;
    var phone = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, statusText, phone, index);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, statusText, phone, index, label) {
  var html = `
      <div class="store-info-window">
          <div class="store-info-name">
              ${name}
          </div>
          <div class="store-info-status">
              ${statusText}
          </div>
          <div class="store-info-address">
              <div class="circle">
                  <i class="fas fa-location-arrow"></i>
              </div>
              ${address}
          </div>
          <div class="store-info-phone">
              <div class="circle">
                  <i class="fas fa-phone-alt"></i>
              </div>
              ${phone}
          </div>
      </div>
    `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    //label: `${index + 1}`,
    //label: { color: "white" },
    animation: google.maps.Animation.DROP,
    icon: {
      url: "./location1.png",
      //http://maps.google.com/mapfiles/ms/icons/blue-dot.png
    },
  });

  google.maps.event.addListener(marker, "mouseover", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  google.maps.event.addListener(marker, "click", function () {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
      marker.setLabel(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
      marker.setLabel({
        text: `${index + 1}`,
        color: "white",
        fontWeight: "bold",
      });
    }
  });

  markers.push(marker);
}
