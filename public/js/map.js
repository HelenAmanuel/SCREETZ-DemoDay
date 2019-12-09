// Mapping coodinates

var walking = document.getElementsByClassName("walking");
var driving = document.getElementsByClassName("driving");

Array.from(walking).forEach( function(element){

element.addEventListener("click", function(){

  let userSelect = this.value

  console.log("user select", userSelect);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
   alert("Geolocation is not supported by this browser.");
  }
}

getLocation()

function showPosition(position) {
  console.log(position.coords.latitude, position.coords.longitude);

 let accessToken = "pk.eyJ1IjoiaGVsZW5hbWFudWVsIiwiYSI6ImNrM2h2N2ZqOTAxajEzbnJwc2kxbDQ3azEifQ.RFNNZQx0bR2czkT75QDmvA"


        fetch(`https://api.mapbox.com/directions/v5/mapbox/${userSelect}/${position.coords.longitude},${position.coords.latitude}?access_token=${accessToken}`)
        .then(response => {
          console.log(response);
          if (response.ok) return response.json()
        })
        .then(data => {
          // console.log(data)
          // window.location.reload(true)
        })

      }
    })
  })

Array.from(driving).forEach( function(element){
      element.addEventListener("click", function(){

        let userSelect = this.value

        console.log("user select", userSelect);

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
         alert("Geolocation is not supported by this browser.");
        }
      }

      getLocation()

      function showPosition(position) {

        console.log(position.coords.latitude, position.coords.longitude);

       let accessToken = "pk.eyJ1IjoiaGVsZW5hbWFudWVsIiwiYSI6ImNrM2h2N2ZqOTAxajEzbnJwc2kxbDQ3azEifQ.RFNNZQx0bR2czkT75QDmvA"


              fetch(`https://api.mapbox.com/directions/v5/mapbox/${userSelect}/${position.coords.longitude},${position.coords.latitude}?access_token=${accessToken}`)
              .then(response => {
                console.log(response);
                if (response.ok) return response.json()
              })
              .then(data => {
                // console.log(data)
                // window.location.reload(true)
              })

            }
          })
        })
