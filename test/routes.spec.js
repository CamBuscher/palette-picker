process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should receive a response of some html when I request root endpoint', done => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done()
    })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
    .get('/butt')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    })
  })
});

describe('API Routes', () => {
  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return an array of projects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Fooo');
        response.body[0].should.have.property('created_at')
        response.body[0].should.have.property('updated_at')
        done();
      })
    })
  })

  describe('GET /api/v1/palettes', () => {
    it('should return an array of palettes', done => {
      chai.request(server)
        .get('/api/v1/palettes')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Lorem');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#2A0AAD');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#BB229D');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#A769A7');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#FD5783');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#D04318');
          response.body[0].should.have.property('created_at')
          response.body[0].should.have.property('updated_at')
          done();
        })
    })
  })

  describe('POST /api/v1/projects', () => {
    it('should return an object containing the id of the new project', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'Test project please ignore'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
        done()
      })
    })

    it('should return a warning string if no name given', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({})
      .end((error, response) => {
        response.should.have.status(422)
        response.should.be.json;
        response.body.should.be.a('object')
        response.body.error.should.equal(`Expected format: { name: <String> }. You're missing a "name" property.`)
        done()
      })
    })
  })

  describe('POST /api/v1/palettes', () => {
    it('should return an object containing the id the new palette', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'Paletteeee',
        color1: '#000000',
        color2: '#000000',
        color3: '#000000',
        color4: '#000000',
        color5: '#000000',
        project_id: 1
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.id.should.equal(3)
        done();
      })
    })

    it('should return an error object if missing a part of the request', done => {
      chai.request(server)
        .post('/api/v1/palettes')
        .send({
          name: 'Paletteeee',
          color2: '#000000',
          color3: '#000000',
          color4: '#000000',
          color5: '#000000',
          project_id: 1
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal(`Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Integer> }. You're missing a "color1" property.`)
          done();
      })
    })
  })

  describe('DELETE /api/v1/palettes/:id', done => {
    it('should return a 204 status if successfully deleted', done => {
      chai.request(server)
        .delete('api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(204);
          response.should.be.json
          response.body.should.be('Success')
          done();
      })
    })
  })

  it('should return an error message if sent a non-existant id', done => {
    chai.request(server)
      .delete('api/v1/palettes/1245')
      .end((error, response) => {
        response.should.have.status(404)
        done()
      })
  })
})