const Router = require('koa-router');

const api = new Router();
const books = require('./books');
const auth = require('./auth');

api.use('/books', books.routes());
api.use('/auth', auth.routes());

module.exports = api;

//이 모듈을 인덱스에 등록해야 쓸 수 있음 