//utilities file

//changing active buttons in navbar
//used in main.js
function setActive(e){
    let el = document.querySelector(`#${e.id}`);
    el.classList.add('active');
}
function removeActive(e){
    let el = document.querySelector(`#${e.id}`);
    el.classList.remove('active');
}

//check if number is between latitude and longitude ranges 
function checkLongitude(num){ //ranges from -180 to +180
    if (!isNaN(num)){
        if(num <= 180 && num >= -180){
            return true;
        }
    }
    //if not a number and not between -180, 180
    return false;
}
function checkLatitude(num){ //ranges from -90 to +90
    if (!isNaN(num)){
        if(num <= 90 && num >= -90){
            return true;
        }
    }
    //if not a number and not between -90, 90
    return false;
}

export{setActive, removeActive, checkLongitude, checkLatitude}