const assert = require('assert');
const {initBook} = require('../tasks/utils/book');


let site;
let pages;

describe('Navigation drawer', () => {
  before(async () => {
    const book = await initBook();
    site = book.site;
    pages = book.pages;
  });

  beforeEach(async () => {
    browser.url('/');

    // I'm not sure why this is needed, but sometime the above command
    // doesn't appear to wait until the page is loaded.
    // (possibly due to service worker???)
    browser.waitUntil(() => {
      return browser.getTitle() == pages[0].title + site.titleSuffix;
    });
  });

  it('should show the menu icon but no nav links on small screens', () => {
    browser
        .setViewportSize({width: 375, height: 627}, false)
        .waitForVisible('#drawer-toggle');
  });

  it('should show the nav links but no menu icon on large screens', () => {
    browser
        .setViewportSize({width: 800, height: 600}, false)
        .waitForVisible('#drawer');

    assert(!browser.isVisible('#drawer-toggle'));
  });

  it('should open a closed drawer when the menu icon is clicked', () => {
    browser
        .setViewportSize({width: 375, height: 627}, false)
        .click('#drawer-toggle')
        .waitForVisible('#drawer');
  });

  it('should close an open drawer when the menu icon is clicked', () => {
    browser
        .setViewportSize({width: 375, height: 627}, false)
        .click('#drawer-toggle')
        .waitForVisible('#drawer');

    browser
        .click('#drawer-toggle')
        .waitUntil(() => !browser.isVisible('#drawer'));
  });

  it('should close an open drawer when clicking a nav link to a new page',
      () => {
    browser.setViewportSize({width: 375, height: 627}, false);
    // Waits for the links to be clickable.
    browser.click('#drawer-toggle').pause(200);
    browser.click(`a[href="${pages[2].path}"]`);

    browser.waitUntil(() =>
        browser.getTitle() == pages[2].title + site.titleSuffix);

    browser.waitUntil(() => !browser.isVisible('#drawer'));
  });

  it('should close an open drawer when clicking anywhere else', () => {
    browser.setViewportSize({width: 375, height: 627}, false);

    browser
        .click('#drawer-toggle')
        .waitForVisible('#drawer');

    browser
        .click('body')
        .waitUntil(() => !browser.isVisible('#drawer'));
  });
});
