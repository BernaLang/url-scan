const inputUrl = require('../input-url');
const remoteHtml = require('../remote-html');
const actions = require('../actions');

const assert = require('assert');

// User input test
describe('User Input', function() {
    describe('#validateUrl()', function() {
        it('Should return the URL', function() {
            assert.equal( inputUrl.validateUrl("https://google.pt"), "https://google.pt");
        });
        it('Should return undefined (invalid url)', function() {
            assert.equal( inputUrl.validateUrl("this is not a url"), undefined);
        });
    });
});

// Describe Remote Html
describe('Remote HTML', function() {
    describe('#getBody()', function() {
        it('Should return body string', function(done) {
            remoteHtml.getBody("https://google.pt")
            .then(
                (res) => {
                    done();
                },
                (err) => {
                    done(err);
                }
            )
        });
    });
    describe('#parseHTML()', function() {
        it('Should return parsed HTML', function() {
            return remoteHtml.parseHTML("<html><body><div id='foo'></div></body></html>");
        });
        it('Should return false (no html provided)', function() {
            return remoteHtml.parseHTML("");
        });
    });
});

// Describe actions
describe('Actions', function() {

    describe('#getTreeDepth()', function() {
        it('Should return JSON object with the tree depth and the info of the tag', function() {
            let parsedTest = remoteHtml.parseHTML("<html><body class='page'><div id='foo' class='col-sm-3'><p></p></div><div class='text-center'></div></body></html>");
            let treeDepth = actions.getTreeDepth(parsedTest);
            assert.deepEqual(treeDepth, { tag: 'p', depth: 3, parents: [ 'div', 'body', 'html' ] });
        });
    });

    describe('#getChildrenByTag()', function() {
        it('Should return JSON object with each HTML element, children count and children tag name count', function() {
            let parsedTest = remoteHtml.parseHTML("<html><head></head><body class='page'><div id='foo' class='col-sm-3'><p></p></div><div class='text-center'></div></body></html>");
            let childrenCount = actions.getChildrenByTag(parsedTest);
            assert.deepEqual(childrenCount, { html: { childrenCount: 2, children: { 'head': 1, 'body': 1 } }, body: { childrenCount: 2, children: { 'div': 2 } }, div: { childrenCount: 1, children: { p: 1 } } });
        });
    });

    describe('#countElements()', function() {
        it('Should return JSON object with each HTML element and their count', function() {
            let parsedTest = remoteHtml.parseHTML("<html><head></head><body><div></div><div></div></body></html>");
            let countedElements = actions.countElements(parsedTest);
            assert.deepEqual(countedElements, { html: 1, head: 1, body: 1, div: 2 });
        });
    });
    describe('#countAtributesByTag()', function() {
        it('Should return JSON object with each HTML element that contains at least 1 attribute and a count of how many', function() {
            let parsedTest = remoteHtml.parseHTML("<html><body class='page'><div id='foo' class='col-sm-3'></div><div class='text-center'></div></body></html>");
            let countedAttributes = actions.countAtributesByTag(parsedTest);
            assert.deepEqual(countedAttributes, { body: { class: 1 }, div: { id: 1, class: 2 } });
        });
    });
    describe('#getLoadedResources()', function() {
        it('Should return array with JSON objects with info of each loaded resource', async function() {
            // Easier to read
            let parsedTest = remoteHtml.parseHTML(`
                <html>
                    <body class='page'>
                        <div id='foo' class='col-sm-3'></div>
                        <div class='text-center'></div>
                        <img src="/assets/imgs/foo.jpeg">
                        <img src="/assets/logos/bar.png">
                        <script src="https://cdn.com/jquery.js"></script>
                    </body>
                </html>
            `);
            let loadedResources = await actions.getLoadedResources(parsedTest, "https://google.pt", false);
            assert.deepEqual(loadedResources, [
                {
                    path: "/assets/imgs/foo.jpeg",
                    absolutePath: "https://google.pt/assets/imgs/foo.jpeg",
                    tagName: "img",
                    file: "foo.jpeg",
                    fileExtension: ".jpeg"
                },
                {
                    path: "/assets/logos/bar.png",
                    absolutePath: "https://google.pt/assets/logos/bar.png",
                    tagName: "img",
                    file: "bar.png",
                    fileExtension: ".png"
                },
                {
                    path: "https://cdn.com/jquery.js",
                    absolutePath: "https://cdn.com/jquery.js",
                    tagName: "script",
                    file: "jquery.js",
                    fileExtension: ".js"
                }
            ]);
        });
    });
});