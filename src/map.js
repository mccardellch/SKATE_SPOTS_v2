let map;
let biggerSmaller;

// geojson Collections of Parks, Shops, Spots
let parkList = { type: 'FeatureCollection', features: [] };
let shopList = { type: 'FeatureCollection', features: [] };
let spotList = { type: 'FeatureCollection', features: [] };

//array default to hold default locations
const defaults = [{ 
    latitude:33.987127,
    longitude:-118.475288,
    description: 'skate park',
    title:'Venice Beach Skatepark',
    type: 'park'
},
{
    latitude:32.818556,
    longitude:-79.955830,
    description: 'skate park',
    title:'SK8 Charleston',
    type: 'park'
},
{
    latitude:39.899861,
    longitude:-75.176443,
    description: 'skate park',
    title:'FDR Skatepark',
    type: 'park'
},
{
    latitude:43.150860,
    longitude:-77.608125,
    description: 'Park in-progress',
    title:'Roc City Skatepark',
    type: 'park'
},
{
    latitude:40.711652,
    longitude:-73.992190,
    description: 'The Big Apple',
    title:'LES Skatepark',
    type: 'park'
},
{
    longitude : -77.585991,
    latitude : 43.149804,
    description : "Rochester's Best",
    title : "Krudco",
    type: 'shop'
},
{
    longitude : -118.449681,
    latitude : 34.045985,
    description : 'A classic',
    title : 'West LA Courthouse',
    type : 'spot'    
},
{
    longitude : -122.445592,
    latitude : 37.780338,
    description : 'Huge stairs',
    title : 'Wallenberg Set',
    type : 'spot'    
}];

function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoibWNjYXJkZWxsY2giLCJhIjoiY2s4eXE0dWJrMThzazNtc2ZrdTZxYm1lMyJ9.Wat_WUs6SCPPThML2oGmeA';
    map = new mapboxgl.Map({
        container: 'map', //container id
        style: 'mapbox://styles/mapbox/outdoors-v11',
        zoom: 3,    //start zoom
        center: [-99, 34] //start pos [longitude, latitude]
    });
    
    //resize the canvas if navFull is clicked
    map.on('load', function() {
        let navFull = document.querySelector('#navFull');
        let mapCanvas = document.querySelectorAll('.mapboxgl-canvas')[0];
        let mapDiv = document.querySelector('#map');
        
        navFull.onclick = function() {
            if (biggerSmaller !== 'smaller') {
                mapDiv.style.width = '75%';
                mapCanvas.style.width = '100%';
                biggerSmaller = 'smaller';                
            } else {
                console.log('smaller');
                mapDiv.style.width = '750px';
                mapCanvas.style.width = '100%';
                biggerSmaller = 'bigger';
            }
            map.resize();
        }
    }); //end map.on()
    
    loadMarkers(defaults);
    addMarkersToMap();
}


// add markers to map by looping through park,shop,spot Lists
function addMarkersToMap(){
    //loop through Park List
    for(let feature of parkList.features) {
        createMarker(feature.properties.title, 
                     feature.properties.description, 
                     'park',
                     feature.geometry.coordinates);
    }
    
    //loop through ShopList
    for(let feature of shopList.features) {
        createMarker(feature.properties.title, 
                     feature.properties.description, 
                     'shop',
                     feature.geometry.coordinates);
    }
    
    //loop through SpotList
    for(let feature of spotList.features) {
        createMarker(feature.properties.title, 
                     feature.properties.description, 
                     'spot',
                     feature.geometry.coordinates);
    }
}

//create markers using coords, title, desc, locationType (park, shop, spot)
function createMarker(title, description, type, coordinates){
    let el = document.createElement('div');
    el.className = type;
    
    new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}) //add popups
        .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
        .addTo(map);
}


// Creats default locations and pushes them to list to be drawn on map
function loadMarkers(list){
    
    //now convert the [long, lat, desc, type, title] data to GeoJSON
    for (let elements of list){ // let 'type' of 'list'
        const newFeature = {         //an empty GeoJSON feature
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: []
            },
            properties: {
                title: '',
                description: '',
                type: ''
            }
        };
        
        //add some properties for the current list
        newFeature.geometry.coordinates[0] = elements.longitude;
        newFeature.geometry.coordinates[1] = elements.latitude;
        newFeature.properties.description = elements.description;
        newFeature.properties.title = elements.title;
        newFeature.properties.type = elements.type;
        
        //push to GeoJSON array 
        switch(elements.type)
        {
            case 'park':
                parkList.features.push(newFeature); //push to park list 
                break;
            case 'shop':
                shopList.features.push(newFeature); //push to shop list
                break;
            case 'spot':
                spotList.features.push(newFeature); //push to spot list
                break;
        }
    } //-end for-
}

function flyTo(center = [0,0]){
    map.flyTo({center: center});
}

function setZoomLevel(value = 0){
    map.setZoom(value);
}

function setPitchAndBearing(pitch=0, bearing=0){
    map.setPitch(pitch);
    map.setBearing(bearing);
}

export{initMap, addMarkersToMap, createMarker, loadMarkers, flyTo, setZoomLevel, setPitchAndBearing};

// Mapbox GL documentation - https://docs.mapbox.com/mapbox-gl-js/api/