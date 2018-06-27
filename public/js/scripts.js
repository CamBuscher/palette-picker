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
      console.log(box)
      if (boxes[box].locked) {
        appendBox(box, boxes[box].color) 
      } else {
        const color = hexGenerator()

        appendBox(box, color)
      }
    })
  }

  generateColors()
})