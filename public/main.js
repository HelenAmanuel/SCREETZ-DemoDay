var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = document.getElementById("photo").src
        const caption =document.getElementById("caption").value
        const tags = document.getElementById("tags").textContent
        const latitude = this.parentNode.childNodes
        console.log(photo,caption)
        fetch('photos', {
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
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = this.parentNode.childNodes[1].value
        const caption = this.parentNode.childNodes[4].innerText
        const tags = this.parentNode.childNodes[7].innerText
        const latitude = this.parentNode.childNodes[9].innerText
        const longitude = this.parentNode.childNodes[11].innerText
        console.log(photo,caption,address)
        fetch('photos', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'tags': tags
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
