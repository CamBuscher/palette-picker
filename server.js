const express = require('express'); //bring in express, which helps with our usage of Node. 
const bodyParser = require('body-parser'); //body parser is a module which helps us read the bodies of requests
const app = express(); //initializing a new instance of express which gives us access to the express / node methods
const environment = process.env.NODE_ENV || 'development'; //specifying which environment in which to work, either the host's given environement or default to development
const configuration = require('./knexfile')[environment]; // uses the specified environment to grab desired configuration from knexfile
const database = require('knex')(configuration); //tells our server which database to use based on above configuration files

app.set('port', process.env.PORT || 3000); //sets the port of the application to the hosted environment's or 3000 by defauly
app.locals.title = 'Palette Picker'; //Set's the title of the app (i.e. in a browser tab)

app.use(bodyParser.json()); //allows body parser to parse json
app.use(express.static('public')); //sends the static file in the public directory

app.use(function (req, res, next) { //app.use helps set up middleware, in this function's case it is allowing all CORS requests 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(app.get('port'), () => { //listens for the specified port to start running, will console log that it is running when server starts
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});

app.get('/api/v1/projects', (request, response) => { //specifies a get request at the given url
  database('projects').select() //selects all rows within the projects table in my database, similar to SELECT * FROM projects
    .then(projects => {
      response.status(200).json(projects); //if it's successful, send back the projects (an array), with status code 200
    })
    .catch(error => {
      response.status(500).json({ error }) //if unsuccessful, send back the error message with status code 500
    })
});

app.get('/api/v1/palettes', (request, response) => { //specifies a get request at given url
  database('palettes').select() //selects all rows within the palettes table in database, similar to SELECT * FROM paletes
    .then(palettes => {
      response.status(200).json(palettes); //if successful, send palettes with 200 code
    })
    .catch(error => {
      response.status(500).json({ error }) //if unsuccessful, send error with 500 code
    })
});

app.post('/api/v1/projects', (request, response) => { //specifies how to handle a post request to given url
  const project = request.body; //grabs the body of the request (using body parser), and assigns it to the variable project

  for (let requiredParameter of ['name']) { //this is my check to make sure all require paramaters are within the body, a cool authorization stolen from the lesson, if a parameter is missing then send a 422 status code with the error message of their missing parameter
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`});
    }
  }

  database('projects').insert(project, 'id') //if all the parameters are there, go to projects table and insert the new project, and return the id
    .then(project_id => {
      response.status(201).json({ id: project_id[0] }) //if successful respond with code 201(received input) and an object containing the id
    })
    .catch(error => {
      response.status(500).json({ error }); //else, respond with error
    });
});

app.post('/api/v1/palettes', (request, response) => { //Exact same as projects insert above, just more required parameters to check
  const palette = request.body;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette_id => {
      response.status(201).json({ id: palette_id[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => { //a dynamic url which takes in an id of a palette to delete it from the table
  const id = request.params.id 

  database('palettes').where('id', id).del() //go to the palettes database and delete a row whose id matches the given id
    .then(rowsDeleted => {
      if (rowsDeleted === 0) { //my way of checking for no match found. it's hard to know if an id isn't in the table until you don't find one
        response.status(404).json({ error: "No matching ID found, please enter a valid id."}) //if no id found, return with 404 error, wrong ID
      } else {
        response.sendStatus(204) //else, send back a 204 status only, it was successful
      }
    })
    .catch(error => {
      response.status(500).json({ error }) //as always, if server errs, 500
    })
})

module.exports = app //export for testing purposes