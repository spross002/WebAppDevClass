var markers = [];

const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    await axios.put('/places', { label: label, address: address });
    await loadPlaces();

    // clear form inputs after place submission
    document.querySelector("#label").value = '';
    document.querySelector("#address").value = '';

    // fly to the marker of the newly added place
    const lat = markers[markers.length - 1]._latlng.lat;
    const lng = markers[markers.length - 1]._latlng.lng;
    map.flyTo(new L.LatLng(lat, lng));
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    await loadPlaces();
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            if(place.lat && place.lng){
                marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
            }
            const tr = document.createElement('tr');
            tr.setAttribute('data-lat', place.lat);
            tr.setAttribute('data-lng', place.lng);
            tr.onclick = on_row_click;
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    }
}

const on_row_click = (e) => {
    console.log(e.target) // this is the element clicked
    console.log(e.target.tagName) // prints the element type (ie. TD)

    let row = e.target;
    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
    }

    const lat = row.dataset.lat;
    const lng = row.dataset.lng;

    map.flyTo(new L.LatLng(lat, lng));
}

// The 'map' parameter is refering to the #map element.
// Initialized to around Ramapo College
const map = L.map('map').setView([41.08224455, -74.1738235180645], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);