import BlogDraft from '../api/v1.0/models/blogdraft';
import BlogPost from '../api/v1.0/models/blogpost';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assertArrays = require('chai-arrays');
const server = require('../bin/www');

const should = chai.should();
const { expect } = chai;
chai.use(assertArrays);
chai.use(chaiHttp);

const blog = {
  title: 'Hello World',
  category: 'Test',
  body: 'Testing This Guy',
  metadata: 'hello who is the man in the building',
  // postImage: 'well.jpg',
};
const draft = new BlogDraft(blog);

const post = new BlogPost(blog);

describe('Mm server', async () => {
  describe('/GET server', () => {
    it('it should load the server', (done) => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal({ message: 'Welcome to the  Beenah API!' });
          done();
        });
    });
  });

  describe('Test for Drafts', () => {
    describe('Post draft', () => {
      it('it should save a draft', (done) => {
        chai.request(server)
          .post('/api/draft/')
          .send(draft)
          .end((err, res) => {
            res.should.have.status(201);
            expect(res.body).to.deep.equal({ status: 201, success: 'saved to draft' });
            done();
          });
      });
    });

    describe('Update draft', () => {
      it('it should update a draft', (done) => {
        draft.save((err, draft) => {
          chai.request(server)
            .put(`/api/draft/${draft.id}`)
            .send({
              title: 'The Chronicles of Narnia',
              category: 'Test',
              body: 'Testing This Guy',
              metadata: 'hello who is the man in the building',
            })
            .end((err, res) => {
              res.should.have.status(201);
              expect(res.body).to.deep.equal({ message: 'update successful' });
              done();
            });
        });
      });
    });

    describe('Get draft', () => {
      it('it should get a draft', (done) => {
        chai.request(server)
          .get(`/api/draft/${draft.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('Delete draft', () => {
      it('it should delete a draft', (done) => {
        chai.request(server)
          .delete(`/api/draft/${draft.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal({ message: 'post deleted' });
            done();
          });
      });
    });

    describe('All Drafts', () => {
      it('it should get all drafts', (done) => {
        chai.request(server)
          .get('/api/draft')
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.drafts).to.be.array();
            done();
          });
      });
    });
  });

  describe('Test for BlogPosts', () => {
    describe('save post', () => {
      it('it should save a post', (done) => {
        chai.request(server)
          .post('/api/post/')
          .send(post)
          .end((err, res) => {
            res.should.have.status(201);
            expect(res.body).to.deep.equal({ status: 201, success: 'saved to post' });
            done();
          });
      });
    });

    describe('Update post', () => {
      it('it should update a post', (done) => {
        post.save((err, post) => {
          chai.request(server)
            .put(`/api/post/${post.id}`)
            .send({
              title: 'The Chronicles of Narnia',
              category: 'Test',
              body: 'Testing This Guy',
              metadata: 'hello who is the man in the building',
            })
            .end((err, res) => {
              res.should.have.status(201);
              expect(res.body).to.deep.equal({ message: 'update successful' });
              done();
            });
        });
      });
    });

    describe('Get post', () => {
      it('it should get a draft', (done) => {
        chai.request(server)
          .get(`/api/post/${post.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('Delete post', () => {
      it('it should delete a post', (done) => {
        chai.request(server)
          .delete(`/api/post/${post.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal({ message: 'post deleted' });
            done();
          });
      });
    });

    describe('All Posts', () => {
      it('it should get all posts', (done) => {
        chai.request(server)
          .get('/api/post')
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.posts).to.be.array();
            done();
          });
      });
    });
  });
});
