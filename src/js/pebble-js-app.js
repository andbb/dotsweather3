var myAPIKey = '409e5e023794383f2481d5c8121e2f4c';

var savedTime=-1;
var savedCoordinates;

function iconFromWeatherId(weatherId) {
  if (weatherId < 600) {
    return 2;
  } else if (weatherId < 700) {
    return 3;
  } else if (weatherId > 800) {
    return 1;
  } else {
    return 0;
  }
}

function fetchWeather(latitude, longitude,speed,sp_deg) {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?' +
    'lat=' + latitude + '&lon=' + longitude + '&cnt=1&appid=' + myAPIKey, true);
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        console.log(req.responseText);
        var response = JSON.parse(req.responseText);
        var temperature = Math.round(response.main.temp - 273.15);
        var icon = iconFromWeatherId(response.weather[0].id);
        var city = response.name;
        var windspd = Math.round(response.wind.speed);
        var whead = headdir(response.wind.deg);
        var sphead = headdir(sp_deg);
        speed=100*speed;
        console.log(temperature);
        console.log(icon);
        console.log(city);
        console.log('Log '+temperature + '\xB0C '+ windspd+' '+whead);
        console.log('Speed ' +speed+' '+sp_deg+' '+sphead+' ');
        console.log('T ' + temperature + '\xB0C '+ windspd+''+whead,'Speed ', Math.round(speed*10)/10 +' '+sphead+' ');
        console.log('WEATHER_TEMPERATURE_KEY2 - '+ temperature + '\xB0C '+ windspd+''+whead);
        console.log('WEATHER_CITY_KEY - ' + Math.round(speed*10)/10 +' '+sphead+' ');
 /*       Pebble.sendAppMessage({
          'WEATHER_ICON_KEY': 2,
          'WEATHER_TEMPERATURE_KEY': temperature*10,
          'WIND_DIR_KEY': response.wind.deg,
          'WIND_SPEED_KEY': windspd*100,
          'DIR_KEY':  sp_deg,
          'SPEED_DIR_KEY': speed*100
        });
  */      
        Pebble.sendAppMessage({
          'WEATHER_ICON_KEY': 2,
          'WEATHER_TEMPERATURE_KEY': 32,
          'WIND_DIR_KEY': 69,
          'WIND_SPEED_KEY': 23,
          'DIR_KEY': 47,
          'SPEED_DIR_KEY': 39
        });
        console.log('Message sent');

/*        Pebble.sendAppMessage({
//          'WEATHER_TEMPERATURE_KEY2': temperature + '\xB0C '+ windspd+''+whead,
//          'WEATHER_TEMPERATURE_KEY2': 17,
          'WEATHER_ICON_KEY': 2,
          'WEATHER_TEMPERATURE_KEY2': temperature*10,
          'WEATHER_CITY_KEY': Math.round(speed*10)/10 +' '+sphead+' '
        });
*/       
      } else {
        
        console.log('Error');
      }
    }
  };
  req.send(null);
}

function headdir(dirdeg) {
  var winddeg;
  if (dirdeg<22) {
          winddeg='N';
        } else
        if (dirdeg<67) {
          winddeg='NE';
        } else
        if (dirdeg<112) {
          winddeg='E';
        } else
        if (dirdeg<157) {
          winddeg='SE';
        } else
        if (dirdeg<202) {
          winddeg='S';
        } else
        if (dirdeg<247) {
          winddeg='SW';
        } else
        if (dirdeg<292) {
          winddeg='W';
        } else
        if (dirdeg<337) {
          winddeg='NW';
        } else
        if (dirdeg<361) {
          winddeg='N';
        }
    return winddeg;
}

function locationSuccess(pos) {
  var coordinates = pos.coords;
//  var savedTime;
//  var savedCoordinates;
  var timediff;
  
    var mvmt=calcCrow(55.82578794865059,12.486526686709826,55.82564300066553,12.486526204934268);
    console.log('Crow test mv',mvmt.d,mvmt.dist,mvmt.brng,mvmt.bearing);
  //  if ( typeof savedCoordinates == 'undefined' ) {
  if (savedTime==-1){
    console.log('Initiation');
     savedTime=Date() ;
    timediff=60;
    // It has not... perform the initialization
    savedCoordinates=coordinates;
    
    coordinates.speed="0";
    coordinates.heading=0;
    console.log("No saved");

  } else {
    var timex= +new Date();
    console.log("Saved old tdif1,time,savedtime, [savedcoord] ", timediff,timex,savedTime,  savedCoordinates);
    timediff = (timex - savedTime)/1000 ;
//    var one_day=1000*60*60*24 ;   
//    console.log("Saved new tdif,time,savedtime, [savedcoord]", timediff,timex,savedTime,  savedCoordinates);
    savedTime=+new Date();
//    timediff=60;
//    console.log("Saved new tdif,time,savedtime, [savedcoord]", timediff,timex,savedTime,  savedCoordinates);
    var movement=calcCrow(savedCoordinates.latitude,savedCoordinates.longitude,coordinates.latitude, coordinates.longitude);
    console.log('Crow input',savedCoordinates.latitude,savedCoordinates.longitude,coordinates.latitude, coordinates.longitude);
    console.log('Crow mv',movement.d,movement.dist,movement.brng,movement.bearing);
    savedCoordinates=coordinates;
    coordinates.speed=movement.dist/timediff;
    coordinates.heading=movement.bearing;

  }
  
   var speed=coordinates.speed;
   var heading=coordinates.heading;
//  fetchWeather(coordinates.latitude, coordinates.longitude);
    console.log('Location');
    console.log('Coor',coordinates);
    console.log('Saved coord',savedCoordinates);
    console.log('Speed, heading',speed,heading);
    console.log('Saved elements',savedCoordinates.latitude, savedCoordinates.longitude,savedCoordinates.speed,savedCoordinates.heading);
    console.log('FW input',coordinates.latitude, coordinates.longitude,coordinates.speed,coordinates.heading);
    fetchWeather(coordinates.latitude, coordinates.longitude,coordinates.speed,coordinates.heading);
}

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371e3; // metres
      var phi1 = toRad(lat1);
      var phi2 = toRad(lat2);
      var dphi = toRad(lat2-lat1);
      var dlambda = toRad(lon2-lon1);

      var a = Math.sin(dphi/2) * Math.sin(dphi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dlambda/2) * Math.sin(dlambda/2);
      var c=2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;
      var brng = toDeg(c);
      console.log("Crow ",d,brng);
      console.log("Crow2 ",lat1, lon1, lat2, lon2, d,brng,((brng + 360) % 360));
      return {dist:d, bearing: ((brng + 270) % 360)};

    }

function oldcalcCrow(lat1, lon1, lat2, lon2) 
    {
      
//NEBRASKA, USA (Latitude : 41.507483, longitude : -99.436554) and
//KANSAS, USA (Latitude : 38.504048, Longitude : -98.315949)
/*      lat1= 41.507483;
      lon1= -99.436554;
      lat2= 38.504048;
      lon2=-98.315949;
*/      var R = 6371000; // m
//      R = 6371; // m
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
//      return d;
      
//      var dLon = this._toRad(lng2-lng1);
//      var y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
//      var x = Math.cos(this.toRad(lat1))*Math.sin(this.toRad(lat2)) - Math.sin(this.toRad(lat1))*Math.cos(this.toRad(lat2))*Math.cos(dLon);
//      var brng = this.toDeg(Math.atan2(y, x));
      var y = Math.sin(dLon) * Math.cos(toRad(lat2));
      var x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(dLon);
      var brng = toDeg(Math.atan2(y, x));
      console.log("Crow ",d,brng);
      console.log("Crow2 ",lat1, lon1, lat2, lon2, d,brng,((brng + 360) % 360));
      return {dist:d, bearing: ((brng + 270) % 360)};
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
    function toDeg(Value) 
    {
        return Value / Math.PI * 180;
    }


function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  Pebble.sendAppMessage({
    'WEATHER_CITY_KEY': 'Loc Unavailable',
    'WEATHER_TEMPERATURE_KEY': 'N/A'
  });
}

var locationOptions = {
  'timeout': 15000,
  'maximumAge': 60000
};

Pebble.addEventListener('ready', function (e) {
  console.log('connect!' + e.ready);
  window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
  console.log(e.type);
  console.log(e.payload);
  
});

Pebble.addEventListener('appmessage', function (e) {
  window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
  console.log(e.type);
  console.log(e.payload.temperature);
  console.log(e.payload);
  console.log('message!');
});

Pebble.addEventListener('webviewclosed', function (e) {
  console.log('webview closed');
  console.log(e.type);
  console.log(e.response);
});
