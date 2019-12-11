var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const photo = this.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]
        const caption = this.parentNode.parentNode.childNodes[1].childNodes[5].innerText
        const tags = this.parentNode.parentNode.childNodes[1].childNodes[7].innerText
        const thumb= parseFloat(this.parentNode.parentNode.childNodes[1].childNodes[9].innerText)
        const name = this.parentNode.childNodes[15].innerText
        console.log("here is our", name)

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

const deletePhoto = str =>{
  fetch('photos', {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'id' : str
            })
          }).then(function (response) {
            window.location.reload()
          })
        }


// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const photo = this.parentNode.parentNode.childNodes[1].childNodes[1]
//         const caption = this.parentNode.parentNode.childNodes[1].childNodes[11].innerText
//         const tags = this.parentNode.parentNode.childNodes[1].childNodes[14].innerText
//         const thumb= parseFloat(this.parentNode.parentNode.childNodes[1].childNodes[4].innerText)
//         const trash= this.parentNode.parentNode.childNodes[1].childNodes[8]
//         const name = document.querySelector("#hidden")
//         console.log("name is",name)
//         fetch('photos', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'photo': photo,
//             'caption': caption,
//             'tags': tags,
//             'thumbUp':thumb,
//             'trash':trash,
//             'id' : name
//           })
//         }).then(function (response) {
//           // window.location.reload()
//         })
//       });
// });
