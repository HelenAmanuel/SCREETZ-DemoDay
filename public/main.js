var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]
        const caption = this.parentNode.childNodes[3].innerText
        const tags = this.parentNode.childNodes[5].innerText
        const thumb= parseFloat(this.parentNode.childNodes[7].innerText)
        const trash= this.parentNode.childNodes[13].innerText
        const name = this.parentNode.childNodes[15].innerText

        fetch('photos', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'tags':tags,
            'thumb':Number(thumb),
            'id' : name
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
        const photo = this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]
        const caption = this.parentNode.childNodes[3].innerText
        const tags = this.parentNode.childNodes[5].innerText
        const thumb= parseFloat(this.parentNode.childNodes[7].innerText)
        const trash= this.parentNode.childNodes[13].innerText
        const name = this.parentNode.childNodes[15].innerText
        console.log(trash)
        fetch('photos', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'photo': photo,
            'caption': caption,
            'tags': tags,
            'thumbUp':thumb,
            'trash':trash,
            'id' : name
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
