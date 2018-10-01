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
    const html = swipe_element.html();
    
    assert.equal(html, "<div id='element-page_id-element_id' class='image_box'><div id='element-page_id-element_id_inner' class='element_inner'><img src='http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png' class='image_element image_element_page_page_id' id='element-page_id-element_id_image' __page_id='page_id' __element_id='element_id' __base_id='element-page_id-element_id' ></img></div></div>");
  });
});

describe('swipe page test', function () {
  it('swipe element: image', function(){
    const info = {elements: [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png" }]};
    const page_id = "page_id";
    const element_id = "element_id";
    
    const swipe_page = new SwipePage(info, {}, 1);
    swipe_page.loadElement();

    const html = swipe_page.getHtml();
    
    assert.equal(html, "<div id='page_1' class='page' __page_id='1'><div id='element-1-0' class='image_box'><div id='element-1-0_inner' class='element_inner'><img src='http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png' class='image_element image_element_page_1' id='element-1-0_image' __page_id='1' __element_id='0' __base_id='element-1-0' ></img></div></div></div>");
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
