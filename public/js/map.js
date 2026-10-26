if (listing.geometry && listing.geometry.coordinates) {
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9,
  });

  const popupContent = document.createElement("div");
  popupContent.className = "map-click";
  const popupTitle = document.createElement("h4");
  const popupTitleText = document.createElement("b");
  popupTitleText.textContent = listing.title;
  popupTitle.appendChild(popupTitleText);
  const popupText = document.createElement("p");
  popupText.textContent = "Exact location will be provided after booking.";
  popupContent.append(popupTitle, popupText);

  const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
    .addTo(map);

  map.addControl(new mapboxgl.ScaleControl());
  map.addControl(new mapboxgl.NavigationControl());
} else {
  document.getElementById("map").textContent =
    "Map is not available for this listing.";
}
