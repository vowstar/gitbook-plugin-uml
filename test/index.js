var path = require('path');
var tester = require('gitbook-tester');
var assert = require('assert');

var pkg = require('../package.json');

const TEST_CONTENT_PNG = '<p><img src="assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.png"></p>';
const TEST_CONTENT_SVG = '<p><img src="assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg"></p>';
const TEST_SRCFILE_PNG = '<p><img src="assets/images/uml/5e39e6908033eaefb9e853d01eb7f2462a7ea69c.png"></p>';
const TEST_SRCFILE_SVG = '<p><img src="assets/images/uml/5e39e6908033eaefb9e853d01eb7f2462a7ea69c.svg"></p>';

describe('uml', function() {
    it('should correctly replace by ```uml``` tag', function() {
        return tester.builder()
            .withContent('\n```uml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_CONTENT_PNG);
                var passSvg = (result[0].content == TEST_CONTENT_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
    it('should correctly replace by ```puml``` tag', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_CONTENT_PNG);
                var passSvg = (result[0].content == TEST_CONTENT_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
    it('should correctly replace by ```plantuml``` tag', function() {
        return tester.builder()
            .withContent('\n```plantuml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_CONTENT_PNG);
                var passSvg = (result[0].content == TEST_CONTENT_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
    it('should correctly replace by {% uml %} and enduml {% enduml %} tag', function() {
        return tester.builder()
            .withContent('\n{% uml %}\n@startuml\n(A)->(B)\n@enduml\n{% enduml %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_CONTENT_PNG);
                var passSvg = (result[0].content == TEST_CONTENT_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
    it('should correctly use external plantuml file specified by {% uml src="" %} and enduml {% enduml %} tag', function() {
        return tester.builder()
            .withContent('\n{% uml src="test/test.plantuml"%}{% enduml %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_SRCFILE_PNG);
                var passSvg = (result[0].content == TEST_SRCFILE_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
    it('should correctly use external plantuml file specified by ```puml {src=""} tag', function() {
        return tester.builder()
            .withContent('\n```puml { src = "test/test.plantuml" }\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var passPng = (result[0].content == TEST_SRCFILE_PNG);
                var passSvg = (result[0].content == TEST_SRCFILE_SVG);
                assert.equal(passPng || passSvg, true);
            });
    });
});
