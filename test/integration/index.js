'use strict';

const request = require('supertest');
const bootstrap = require('../../');
const path = require('path');

describe('bootstrap()', () => {

  it('must be given a list of routes', () =>
    (() => bootstrap()).should.Throw('Must be called with a list of routes')
  );

  it('routes must each have a list of one or more steps', () =>
    (() => bootstrap({
      routes: [{}]
    })).should.Throw('Each route must define a set of one or more steps')
  );

  it('requires the path to fields argument to be valid', () =>
    (() => bootstrap({
      fields: 'not_a_valid_path',
      routes: [{
        steps: {},
      }]
    })).should.Throw('Cannot find fields at ' + path.resolve(__dirname, '../../test/not_a_valid_path'))
  );

  it('requires the path to the route fields argument to be valid', () =>
    (() => bootstrap({
      fields: '',
      routes: [{
        steps: {},
        fields: 'not_a_valid_path'
      }]
    })).should.Throw('Cannot find route fields at ' + path.resolve(__dirname, '../../test/not_a_valid_path'))
  );

  it('requires the path to the views argument to be valid', () =>
    (() => bootstrap({
      views: 'not_a_valid_path',
      routes: [{
        steps: {}
      }]
    })).should.Throw('Cannot find views at ' + path.resolve(__dirname, '../../test/not_a_valid_path'))
  );

  it('requires the path to the route views argument to be valid', () =>
    (() => bootstrap({
      routes: [{
        steps: {},
        views: 'not_a_valid_path',
      }]
    })).should.Throw('Cannot find route views at ' + path.resolve(__dirname, '../../test/not_a_valid_path'))
  );

  describe('with valid routes and steps', () => {

    it('returns a promise that resolves with the app', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          steps: {
            '/one': {}
          }
        }]
      }).then(app => app.should.include.keys('listen', 'use'))
    );

    it('starts the service and responds successfully to get requests', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          steps: {
            '/one': {}
          }
        }]
      }).then(app => request(app)
        .get('/one')
        .set('Cookie', ['myCookie=1234'])
        .expect(200))
    );

    it('serves the correct view when requested from each step', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          steps: {
            '/one': {}
          }
        }]
      }).then(app =>
        request(app)
          .get('/one')
          .set('Cookie', ['myCookie=1234'])
          .expect(200)
          .expect(res => res.text.should.equal('<div>one</div>\n'))
      )
    );

    it('responds with a 404 if the resource is not found', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          steps: {
            '/one': {}
          }
        }]
      }).then(app =>
        request(app)
          .get('/not_here')
          .set('Cookie', ['myCookie=1234'])
          .expect(404)
      )
    );

    it('uses a route baseUrl to serve the views and fields at the correct step', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          baseUrl: '/app_1',
          steps: {
            '/one': {}
          }
        }]
      }).then(app =>
        request(app)
          .get('/app_1/one')
          .set('Cookie', ['myCookie=1234'])
          .expect(200)
          .expect(res => res.text.should.equal('<div>one</div>\n'))
      )
    );

    it('can be given a route param', () =>
      bootstrap({
        views: false,
        routes: [{
          views: path.resolve(__dirname, '../apps/app_1/views'),
          params: '/:action?',
          steps: {
            '/one': {}
          }
        }]
      }).then(app =>
        request(app)
          .get('/one/param')
          .set('Cookie', ['myCookie=1234'])
          .expect(200)
          .expect(res => res.text.should.equal('<div>one</div>\n'))
      )
    );

    it('accepts a baseController option', () =>
      bootstrap({
        baseController: require('hof').controllers.base,
        views: path.resolve(__dirname, '../apps/app_1/views'),
        routes: [{
          steps: {
            '/one': {}
          }
        }]
      }).then(app =>
        request(app)
          .get('/one')
          .set('Cookie', ['myCookie=1234'])
          .expect(200)
          .expect(res => res.text.should.equal('<div>one</div>\n'))
      )
    );

  });

});
