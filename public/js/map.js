mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  center: listing.geometry.coordinates,
  zoom: 9
});

const popup = new mapboxgl.Popup({
  offset: 25,
  closeButton: false,
  closeOnClick: false
}).setHTML(`
  <div style="
    font-family: sans-serif;
    font-size: 12px;
    padding: 2px
    background: white;
    border-radius: 6px;
    max-width: none;
  ">
    <strong>${listing.title}</strong> — Location visible after booking
  </div>
`);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

const markerEl = marker.getElement();

markerEl.addEventListener('mouseenter', () => {
  popup.setLngLat(listing.geometry.coordinates).addTo(map);
});

markerEl.addEventListener('mouseleave', () => {
  popup.remove();
});
