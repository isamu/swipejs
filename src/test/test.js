import SwipeElement from "../lib/SwipeElement";
import SwipePage from "../lib/SwipePage";
import SwipeBook from "../lib/SwipeBook";

const chai = require('chai');
const assert = chai.assert;


var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
global.window = window;

global.$ = require('./jquery-2.2.3.min.js')(window);;

const myFunc = () => {
  return 3;
}
describe('swipe element test', function () {
  it('swipe element: image', function(){
    const info = { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png" };
    const page_id = "page_id";
    const element_id = "element_id";
    const swipe_element = new SwipeElement(info, page_id, element_id);
    console.log(swipe_element.html());
  });
});

describe('swipe page test', function () {
  it('swipe element: image', function(){
    const info = {elements: [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png" }]};
    const page_id = "page_id";
    const element_id = "element_id";
    
    const swipe_page = new SwipePage(info, {}, 1);
    swipe_page.loadElement();
    console.log(swipe_page.getHtml());
  });

});

describe('swipe page test', function () {
  it('swipe element: image', function(){
    const info = {elements: [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png" }]};
    const page_id = "page_id";
    const element_id = "element_id";
    
    console.log(SwipeBook);
    const swipe_book = new SwipeBook(info, {}, 1);
    // swipe_book.loadElement();
    // console.log(swipe_page.getHtml());
  });

});
