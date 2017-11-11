const Router = require('koa-router');

const books = new Router();
  // 내용만 한것, 북스를 등록한 게 아님 --api/index에서 라우트연결해야함 
  
  const booksCtrl = require('./books.controller');
  
  books.get('/', booksCtrl.list);
  books.get('/:id', booksCtrl.get);
  books.post('/', booksCtrl.create);
  books.delete('/', booksCtrl.delete);
  books.put('/', booksCtrl.replace);
  books.patch('/', booksCtrl.update);  //풋은 완전히 바꿔주는것 , 패치는 일부수정 
  
  module.exports = books; 