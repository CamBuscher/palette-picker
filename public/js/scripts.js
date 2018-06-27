$(document).ready(() => {
  
  const boxes = {
    box1 : {
      'locked': false,
      'color': null
    },
    box2 : {
      'locked': false,
      'color': null
    },
    box3 : {
      'locked': false,
      'color': null
    },
    box4 : {
      'locked': false,
      'color': null
    },
    box5 : {
      'locked': false,
      'color': null
    }
  }

  $('.generate').on('click', generateColors)
  $('.project-form').on('submit', createNewProject)

  function appendBox(box, color) {
    const style = 'background-color:' + color
    $('.colors-container').append(`
      <div class='color-box' class=${box} style=${style}>
        <p>${color}</p>
      </div>
    `)
  }

  const hexGenerator = () => '#' + ('000000' + (Math.random() * 0xFFFFFF << 0).toString(16)).slice(-6).toUpperCase()

  function generateColors() {
    $('.colors-container').html(`<div></div>`)
    Object.keys(boxes).forEach(box => {
      if (boxes[box].locked) {
        appendBox(box, boxes[box].color) 
      } else {
        const color = hexGenerator()
        appendBox(box, color)
      }
    })
  }

  function createNewProject(e) {
    e.preventDefault();
    const project = $('.project-input').val()

    var data = JSON.stringify({
      "Content-Type": "application/json",
      project
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "http://localhost:3000/api/v1/projects/new");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
 
    $('.project-input').text('')
  }

  generateColors()
})