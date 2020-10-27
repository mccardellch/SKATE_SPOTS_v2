import * as map from './map.js';

const config = {
  apiKey: "AIzaSyBqME1kOJ5rdbIPt4DoV4m4WYDZxKn7kv8",
  authDomain: "project3-f60b1.firebaseapp.com",
  databaseURL: "https://project3-f60b1.firebaseio.com",
  projectId: "project3-f60b1",
  storageBucket: "project3-f60b1.appspot.com",
  messagingSenderId: "395001134333",
  appId: "1:395001134333:web:eb5e5d8f6d6c2356751294",
  measurementId: "G-B6BC8SHY07"
};

//variables for references to firebase nodes
let fbParks;
let fbShops;
let fbSpots;
let db;

// Initialize Firebase
function initFirebase(){
    firebase.initializeApp(config); 
    db = firebase.database(); //get a ref to the database
    
    //create references to the firebase nodes
    fbParks = db.ref('public/parks/'); // refer to a root named 'parks'
    fbShops = db.ref('public/shops/'); // refer to a root named 'shops'
    fbSpots = db.ref('public/spots/'); // refer to a root named 'spots'    
}

//ES6 Module requiremment - class Location
class Location {
    constructor(title, desc, type, lng, lat){
        this.title = title;
        this.desc = desc;
        this.type = type;
        this.coordinates = [lng, lat];
        
        const arrayLocation = [{ 
            latitude: this.lat,
            longitude: this.lng,
            description: this.desc,
            title: this.title,
            type: this.type
        }];
        
    }
    
    //getter methods 
    get getArray() { //return the class object
        return this.arrayLocation;
    }
    
    get getType() { //return the type 
        return this.type();
    }
    
    get getCoordinates() { //return the coordinates 
        return this.coordinates();
    }
}

//broken - does not return the proper index because it is locked in scope of the callback 
//Get path index
//function getIndex(auth='public', type, ){
//    //check the type
//    switch(type)    //get firebase information based on the type passed in
//    {  
//        case 'park': //read parks
//            db.ref(auth + '/parks/').once('value', function(snapshot) {
//                return snapshot.numChildren();
//            });
//            break;
//        case 'shop': //read shops
//            db.ref(auth + '/shops/').once('value', function(snapshot) {
//                return snapshot.numChildren();
//            });
//            break;
//        case 'spot': //read spots
//            db.ref(auth + '/spots/').once('value', function(snapshot) {
//                return snapshot.numChildren();
//            });
//            break;
//    }
//    
//    console.log(index);
//    return index;
//}

//Write to the firebase
function write(auth, title, desc, type, longitude, latitude) {
    // simple authorization so that original database does not get overwritten
    if (auth != '19'){
        auth = 'public';
    }
    
    //create new instance of Location
    let newLocation = new Location(title, desc, type, longitude, latitude);
    
    //check the type and send to that path
    switch(type)
    {
        case 'park':
            //send location to auth + /parks/
            fbParks.once('value', function(snapshot) {
                let numPark = snapshot.numChildren();
                db.ref(auth + '/parks/' + numPark).update(newLocation); 
                alert('New Park ' + newLocation.title + ' added!');
            });
            break;
        case 'shop':
            //send location to auth + /shops/
            fbShops.once('value', function(snapshot) {
                let numShops = snapshot.numChildren();
                db.ref(auth + '/shops/' + numShops).update(newLocation); 
                alert('New Shop ' + newLocation.title + ' added!');
            });
            break;
        case 'spot':
            //send location to auth + /spots/
            fbSpots.once('value', function(snapshot) {
                let numSpot = snapshot.numChildren();
                db.ref(auth + '/spots/' + numSpot).update(newLocation); 
                alert('New Spot ' + newLocation.title + ' added!');
            });
            break;
    }
    
    //let newPostKey = db.ref('parks/').push().key;
    //console.log("new post key: " + newPostKey);
}


//BROKEN
//Can't send information to loadMarkers() due to scope of the callback function and I can't fix it
//Read from the firebase
function read(type){
    let content;    //variable for data to be read
    switch(type)    //get firebase information based on the type passed in
    {  
        case 'park': //read parks
            fbParks.once('value', function(snapshot) {
                let index = snapshot.numChildren();
                if(index == 0){
                    return;
                }
                
                for (let i = 0; i < index; i++){
                    let data = snapshot.val()[0];
                    let newParkObj = new Location(  //title, desc, type, lng, lat
                        data['title'],
                        data['description'],
                        data['type'],
                        data['lng'],
                        data['lat'],
                    );
                    
                    console.log(newParkObj.getArray);
                    map.loadMarkers(newParkObj.getArray);
                }
            });
            break;
        case 'shop': //read shops
            fbShops.once('value').then(function(snapshot) {
                let index = snapshot.numChildren();
                if(index == 0){
                    return;
                }
            });
            break;
        case 'spot': //read spots
            fbSpots.once('value').then(function(snapshot) {
                let index = snapshot.numChildren();
                if(index == 0){
                    return;
                }
            });
            break;
        default: //default if type inputted is invalid (not park, shop, spot)
            console.error('Invalid Read Type, change to \'park\', \'shop,\' \'spot\' ');
            break;
    }
}


export{initFirebase, write, read};