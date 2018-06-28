$(document).ready(() => {

  const boxes = {
    box1: {
      'locked': false,
      'color': null
    },
    box2: {
      'locked': false,
      'color': null
    },
    box3: {
      'locked': false,
      'color': null
    },
    box4: {
      'locked': false,
      'color': null
    },
    box5: {
      'locked': false,
      'color': null
    }
  }

  $('.generate').on('click', generateColors)
  $('.project-form').on('submit', createNewProject)
  $('.palette-form').on('submit', createNewPalette)

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
        boxes[box].color = color
        appendBox(box, color)
      }
    })
  }

  // PROJECTS

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
      <div class='project' id=project${id}>
        <h3>${name}</h3>
      </div>`)

    $('.select').append(`
      <option id='${id}'>${name}</option>
    `)
  }

  function createNewProject(e) {
    e.preventDefault();
    const name = $('.project-input').val()

    postProject({ name })
      .then(response => {
        const id = response.id.toString()
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

  //PALETTES

  function createNewPalette(e) {
    e.preventDefault()
    
    const projectName = $('.save-palette').parent().find('.select').find(":selected").text()
    const projectID = $('.save-palette').parent().find('.select').find(":selected").attr('id')
    const paletteName = $('.palette-input').val()
    const colors = Object.keys(boxes).map(box => boxes[box].color)

    appendPalette(projectID, paletteName, colors, Date.now())
  }

  function appendPalette(id, paletteName, colors, UID) {
    $(`#project${id}`).append(`
      <div class='palette${UID}'>
        <span>${paletteName}</span>
      </div>
    `)

    colors.forEach(color => {
      $(`#project${id}`).children(`.palette${UID}`).append(`
        <div class='palette-color' style="background-color:${color}"></div>
      `)
    })

    $(`#project${id}`).children(`.palette${UID}`).append(`
      <button class='delete'>Delete</button>
    `)
  }

  generateColors()
  fetchExistingProjects()
})