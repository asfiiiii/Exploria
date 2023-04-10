
     //This script is for using Mapbox
    
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v11', // style URL
        center: campCord.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    new mapboxgl.Marker()
    .setLngLat(campCord.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({offset:25})
    //     .setHTML(
    //         `<h4>${camp.title}</h4> <p> ${camp.location} </p>`
    //     )
    // )
    .addTo(map);