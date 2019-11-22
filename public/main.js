var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = this.parentNode.childNodes[1].innerText
        const caption = this.parentNode.childNodes[3].innerText
        const address = this.parentNode.childNodes[5].innerText
        console.log(`ALERT ALERT THE PHOTO IS ${photo} THE CAPTION IS ${caption} THE ADDRESS ${address}`)
        fetch('photos', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'address': address
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = this.parentNode.childNodes[1].innerText
        const caption = this.parentNode.childNodes[3].innerText
        const address = this.parentNode.childNodes[5].innerText
        console.log(photo,caption,address)
        fetch('photos', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'address': address
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
