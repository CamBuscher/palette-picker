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

  function postProject(project) {
    return fetch('http://localhost:3000/api/v1/projects', {
      body: JSON.stringify(project), 
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      })
      .then(response => response.json())
  }

  function appendProject(id, name) {
    $('.existing-projects').append(`
      <div class='project' id=${id}>
        <h3>${name}</h3>
      </div>`)

    $('.select').append(`
      <option id='${id}'>${name}</option>
    `)
  }

  function createNewProject(e) {
    e.preventDefault();
    const name = $('.project-input').val()

    postProject({name})
      .then(response => {
        const id = response.id.toString()
        console.log(response.id.toString())
        appendProject(id, name)
      })
    
    $('.project-input').val('')
  }

  function fetchExistingProjects() {
    fetch('http://localhost:3000/api/v1/projects', {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
    })
      .then(response => response.json())
      .then(projects => projects.forEach(project => appendProject(project.id, project.name)))
  }

  generateColors()
  fetchExistingProjects()
})