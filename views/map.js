// Mapping coodinates
var latitudeField = document.getElementById("latitude");
var longitudeField = document.getElementById("longitude");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
   alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  latitudeField.value = position.coords.latitude;
  longitudeField.value = position.coords.longitude;
  console.log("Latitude Field is" + latitudeField.value)


// fetch for mapbox
 let accessToken = "pk.eyJ1IjoiaGVsZW5hbWFudWVsIiwiYSI6ImNrM2h2N2ZqOTAxajEzbnJwc2kxbDQ3azEifQ.RFNNZQx0bR2czkT75QDmvA"

        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${position.coords.longitude,position.coords.latitude}?access_token=${accessToken}`, {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'tags': tags
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          // console.log(data)
          // window.location.reload(true)
        })

      }


        document.querySelector('button').addEventListener('click', function () {
        fetch('https://data.nasa.gov/resource/9g7e-7hzz.json?$select=facility,location,city,state')
          .then(res => res.json())
          .then(response => {
            const apikey = "72f0b58eb06d0d19d3dcea57046e6ede"
            const locations = response;
            locations.forEach(facility => {
              const longitude = facility.location.coordinates[0]
              const latitude = facility.location.coordinates[1]
              fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${apikey}`)
                .then(res => res.json())
                .then((response) => {
                  const temp = (response.main.temp + "°F")
                  facility.temp = temp;
                  showlocation(facility);
                })
            })
          })
          .catch(err => {
            console.log(`error ${err}`)
            alert("Sorry, there are no results for your search.")
          })
      })
