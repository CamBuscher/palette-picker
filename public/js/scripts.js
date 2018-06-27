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

    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": "http://localhost:3000/api/v1/projects/new",
    //   "method": "POST",
    //   "headers": {
    //     "Content-Type": "application/json",
    //     "Cache-Control": "no-cache",
    //   },
    //   "processData": false,
    //   "data": "{\n\t\"Content-Type\": \"application/json\",\n\t\"project\": \"palette-picker\"\n}"
    // }

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/v1/projects/new",
      data: {
        project,
        "Content-Type": "application/json"
      }
    });
 
    $('.project-input').text('')
  }

  generateColors()
})