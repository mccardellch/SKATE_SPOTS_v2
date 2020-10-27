import * as map from './map.js';
import * as fb from './firebase.js';
import * as utils from './utilities.js';

function init(){
    map.initMap();
    fb.initFirebase();
    setupUI();
    
    //fb.read('park');
    //fb.read('shop');
    //fb.read('spot');
}


//read in firebase data and send to map
function firebaseToMap(){
    maps.loadMarkers(); //takes in a single location and it's information
    fb.read();
}

//get user input from fields and send to map
function writeToFirebase(){
    //get fields
    let nameLocation = document.querySelector('#nameLocation').value; //input field
    let typeLocation = document.querySelector('#typeLocation').value; //select field
    let descLocation = document.querySelector('#descLocation').value; //input field
    let lngLocation = document.querySelector('#longitude').value; //input longitude
    let latLocation = document.querySelector('#latitude').value; //input latitude
    
    if(!utils.checkLongitude(lngLocation)){
        alert("Invalid longitude value.");
        return;
    }
    if(!utils.checkLatitude(latLocation)){
        alert("Invalid latitude value.");
        return;
    }
    
    //call write function of firebase
    fb.write('public', nameLocation, descLocation, typeLocation, lngLocation, latLocation); //params - auth, title, desc, type, long, lat
}

//setup of quick control and navbar buttons 
function setupUI(){
    // [longitude,latitude] - http://geojson.io/
    const rocCity = [-77.608125, 43.150860];
    const veniceBeach = [-118.475288, 33.987127];
    const fdr = [-75.176443, 39.899861];
    
    //Roc City Skatepark
    btn1.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(rocCity);
    }
    
    //Venice beach
    btn2.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(veniceBeach);
    }
    
    //FDR
    btn3.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(fdr);
    }
    
    //World Zoom 0
    btn4.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0,0);
        map.flyTo();
    }
    
//    navSearch.onclick = () => {
//        utils.setActive(navSearch);
//        utils.removeActive(navAdd);
//        utils.removeActive(navFull);
//        
//        // update the display of the divs
//        div_search.style.display = 'inherit';
//        div_add.style.display = 'none';
//    }
//
//    navAdd.onclick = () => {
//        utils.setActive(navAdd);
//        //utils.removeActive(navSearch);
//        utils.removeActive(navFull);
//        
//        // update the display of the divs
//        //div_search.style.display = 'none';
//        div_add.style.display = 'inherit';
//    }
    
    navFull.onclick = () => {
        utils.setActive(navFull);
        //utils.removeActive(navSearch);
        //utils.removeActive(navAdd);
    }
    
    addBtn.onclick = () => {
        writeToFirebase();
    }
    
    document.querySelector('#reset').onclick = resetPage;
}


//clear the fields 
//reset the map to center
function resetPage(){
    console.log('page reset');
    
    //clear all fields
    let elements = document.getElementsByTagName('input');
    for(let node of elements){
        node.value = "";
    }
    
    //reset select
    document.querySelector('#locationType').value = '1';
    
    //show search
    //utils.setActive(navSearch);
    //utils.removeActive(navAdd);
    utils.removeActive(navFull);    
    
    //minmize map
    let mapCanvas = document.querySelectorAll('.mapboxgl-canvas')[0];
    let mapDiv = document.querySelector('#map');

    navFull.onclick = function() {
        mapDiv.style.width = '750px';
        mapCanvas.style.width = '100%';
    }
    
    //return map to world view
    map.setPitchAndBearing();
    map.flyTo([-99, 34]);    
}

/* Local Storage func. - this happens onload */
//declare consts for local storage capability
const nameField = document.querySelector('#nameLocation');
const typeField = document.querySelector('#typeLocation');
const descField = document.querySelector('#descLocation');
const lngField = document.querySelector('#longitude');
const latField = document.querySelector('#latitude');

const prefix = document.querySelector('#username').value + '-';
const nameKey = prefix + 'name';
const typeKey = prefix + 'type';
const descKey = prefix + 'desc';
const lngKey = prefix + 'lng';
const latKey = prefix + 'lat';

//grab the stored data
const storedName = localStorage.getItem(nameKey);
const storedType = localStorage.getItem(typeKey);
const storedDesc= localStorage.getItem(descKey);
const storedLng = localStorage.getItem(lngKey);
const storedLat = localStorage.getItem(latKey);

//if there's a previously set location value, display it
if(storedName){
    nameField.value = storedName;
}
if(storedType){
    typeField.value = storedType;
}
if(storedDesc){
    descField.value = storedDesc;
}
if(storedLng){
    lngField.value = storedLng;
}
if(storedLat){
    latField.value = storedLat;
}

//set to local storage
nameField.onchange = e => {
    localStorage.setItem(nameKey, e.target.value); 
};
typeField.onchange = e => {
    localStorage.setItem(typeKey, e.target.value); 
};
descField.onchange = e => {
    localStorage.setItem(descKey, e.target.value); 
};
lngField.onchange = e => {
    localStorage.setItem(lngField, e.target.value); 
};
latField.onchange = e => {
    localStorage.setItem(latField, e.target.value); 
};

export{init};
