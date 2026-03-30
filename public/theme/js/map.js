document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Coordenadas do IFC - Campus Videira
  var lat = -27.02635661799897;
  var lng = -51.14445241614298;

  // Inicializar o mapa
  var map = L.map("map").setView([lat, lng], 19);

  // Adicionar camada de tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Adicionar marcador
  var marker = L.marker([lat, lng]).addTo(map);

  // Adicionar popup ao marcador
  marker
    .bindPopup(
      '<b>Nossa Localização</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=' +
        lat +
        "," +
        lng +
        '" target="_blank">Como Chegar</a>'
    )
    .openPopup();
});
