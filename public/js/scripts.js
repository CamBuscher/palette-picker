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
  $('.existing-projects').on('click', '.delete', deletePalette)
  $('.colors-container').on('click', '.LOCK',lockBox)
  $('.colors-container').on('click', '.UNLOCK', unlockBox)

  function appendBox(box, color, locked) {
    const lockStatus = locked ? "UNLOCK" : "LOCK"

    const style = 'background-color:' + color
    $('.colors-container').append(`
      <div class='color-box' id=${box} style=${style}>
        <p>${color}</p>
        <div class='${lockStatus}'>${lockStatus}</div>
      </div>
    `)
  }

  const hexGenerator = () => '#' + ('000000' + (Math.random() * 0xFFFFFF << 0).toString(16)).slice(-6).toUpperCase()

  function generateColors() {
    $('.colors-container').html(`<div></div>`)
    Object.keys(boxes).forEach(box => {
      if (boxes[box].locked) {
        appendBox(box, boxes[box].color, true)
      } else {
        const color = hexGenerator()
        boxes[box].color = color
        appendBox(box, color, false)
      }
    })
  }

  function lockBox() {
    const box = $(this).closest('.color-box').attr('id')
    boxes[box].locked = true;
    $(`#${box}`).append(`
      <div class='UNLOCK'>UNLOCK</div>
    `)
    $(this).remove()
  }

  function unlockBox() {
    const box = $(this).closest('.color-box').attr('id')
    boxes[box].locked = false;
    $(`#${box}`).append(`
      <div class='LOCK'>LOCK</div>
    `)
    $(this).remove()
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

  function postPalette(palette) {
    return fetch('http://localhost:3000/api/v1/palettes', {
      body: JSON.stringify(palette),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
      .then(response => response.json())
  }

  function createNewPalette(e) {
    e.preventDefault()
    
    const projectID = $('.save-palette').parent().find('.select').find(":selected").attr('id')
    const paletteName = $('.palette-input').val()
    const colors = Object.keys(boxes).map(box => boxes[box].color)

    postPalette({
      name: paletteName,
      color1: colors[0],
      color2: colors[1],
      color3: colors[2],
      color4: colors[3],
      color5: colors[4],
      project_id: projectID
    }).then(response => {
      const paletteID = response.id.toString()
      appendPalette(projectID, paletteName, colors, Date.now(), paletteID)
    })
  }

  function appendPalette(projectid, paletteName, colors, UID, paletteID) {
    $(`#project${projectid}`).append(`
      <div class='palette palette${UID}'>
        <span id=${paletteID}>${paletteName}</span>
      </div>
    `)

    colors.forEach(color => {
      $(`#project${projectid}`).children(`.palette${UID}`).append(`
        <div class='palette-color' style="background-color:${color}"></div>
      `)
    })

    $(`#project${projectid}`).children(`.palette${UID}`).append(`
      <button class='delete'>Delete</button>
    `)
  }

  function fetchExistingPalettes() {
    fetch('http://localhost:3000/api/v1/palettes', {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
    })
      .then(response => response.json())
      .then(palettes => palettes.forEach(palette => {
        const colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5]
        appendPalette(palette.project_id, palette.name, colors, Date.now(), palette.id)
      }))
  }

  function deletePalette(e) {
    const id = $(this).closest('div').find('span').attr('id')
    
    $(this).closest('div').remove()

    fetch(`http://localhost:3000/api/v1/palettes/${id}`, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
    })
  }

  generateColors()
  fetchExistingProjects()
  fetchExistingPalettes()
})