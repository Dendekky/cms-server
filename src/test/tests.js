var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bin/www');
const assertArrays = require('chai-arrays');
var should = chai.should();
var expect = chai.expect;
chai.use(assertArrays);
chai.use(chaiHttp);
import BlogDraft from '../api/v1.0/models/blogdraft';



const draft = new BlogDraft({
  title: "Hello World",
  category: "Test",
  body: "Testing This Guy",
  metadata: "hello who is the man in the building",
  postImage: "well.jpg",
});

describe('Mm server', async () => {

  describe('/GET server', () => {
      it('it should load the server', (done) => {
            chai.request(server)
            .get('/api')
            .end((err, res ) => {
                  res.should.have.status(200);
                  expect(res.body).to.deep.equal( { message: 'Welcome to the  Beenah API!' } )
              done();
            });
      });
  });

  // await describe('Post draft', () => {
  //   it('it should save a draft', (done) => {
  //     draft.save((err, draft) => {
  //     chai.request(server)
  //       .post('/api/draft/')
  //       .end((err, res) => {
  //         res.should.have.status(201);
  //         expect(res.body).to.deep.equal( { status: 201, success: 'saved to draft' } );
  //         done();
  //       });
  //     });
  //   });
  // });

  await describe('Update draft', () => {
    it('it should update a draft', (done) => {
      draft.save((err, draft) => {
      chai.request(server)
        .put('/api/draft/' + draft.id)
        .send({ title: "The Chronicles of Narnia",
                    category: "Test",
                    body: "Testing This Guy",
                    metadata: "hello who is the man in the building" 
                  })
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body).to.deep.equal( { message: 'update successful' } );
          done();
        });
      });
    });
  });

  await describe('Get draft', () => {
    it('it should get a draft', (done) => {
      chai.request(server)
        .get('/api/draft/' + draft.id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  
  await describe('Delete draft', () => {
    it('it should delete a draft', (done) => {
      chai.request(server)
        .delete('/api/draft/' + draft.id)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal( { message: 'post deleted' } );
          done();
        });
    });
  });
  
  describe('All Drafts', () => {
    it('it should get all drafts', (done) => {
          chai.request(server)
          .get('/api/draft')
          .end((err, res ) => {
                res.should.have.status(200);
                expect(res.body.drafts).to.be.array();
            done();
          });
    });
  });

  describe('All Posts', () => {
    it('it should get all posts', (done) => {
          chai.request(server)
          .get('/api/post')
          .end((err, res ) => {
                res.should.have.status(200);
                expect(res.body.posts).to.be.array();
            done();
          });
    });
  });

});
