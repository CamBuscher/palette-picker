const environment = process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')[environment];
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
})