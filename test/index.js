/*jshint esversion: 8 */

var path = require('path');
var tester = require('honkit-tester');
var assert = require('assert');

var pkg = require('../package.json');

describe('uml', function() {
    it('should correctly replace by ```uml``` tag, mode: svg', function() {
        return tester.builder()
            .withContent('\n```uml\n@startuml\n(Alpha)->(Beta)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml'],
                pluginsConfig: {
                    uml: {
                        format: "svg",
                        charset: "utf8",
                        config: "classic",
                        nailgun: false
                    }
                }
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly replace by ```uml``` tag, mode: png', function() {
        return tester.builder()
            .withContent('\n```uml\n@startuml\n(Alpha)->(Beta)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml'],
                pluginsConfig: {
                    uml: {
                        format: "png",
                        nailgun: false
                    }
                }
            })
            .create()
            .then(function(result) {
                const imageData = result[0].content.match(/<img src="data:image\/png[^]*">/m).toString();
                assert.equal(imageData.includes('data:image/png;base64'), true);
            });
    });
    it('should correctly replace by ```puml``` tag', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n(Alpha)->(Beta)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly replace by ```plantuml``` tag', function() {
        return tester.builder()
            .withContent('\n```plantuml\n@startuml\n(Alpha)->(Beta)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('A'), true);
                assert.equal(svg.includes('B'), true);
            });
    });
    it('should correctly replace by {% uml %} and enduml {% enduml %} tag', function() {
        return tester.builder()
            .withContent('\n{% uml %}\n@startuml\n(Alpha)->(Beta)\n@enduml\n{% enduml %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly use external plantuml file specified by {% uml src="" %} and enduml {% enduml %} tag', function() {
        return tester.builder()
            .withContent('\n{% uml src="test/test.plantuml"%}{% enduml %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withLocalDir(path.join(__dirname, '..', 'test'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly use external plantuml file specified by ```puml {src=""} tag', function() {
        return tester.builder()
            .withContent('\n```puml { src = "test/test.plantuml" }\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withLocalDir(path.join(__dirname, '..', 'test'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly use external plantuml file specified by ```puml @startuml !include ... @enduml tag', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n!include test/test.plantuml\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withLocalDir(path.join(__dirname, '..', 'test'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly use external plantuml file specified in subdirectory', function() {
        return tester.builder()
            .withPage('nested/testpage','\n```puml\n@startuml\n!include test/test.plantuml\n@enduml\n```')
            .withFile('nested/test/test.plantuml', '@startuml\n(Alpha)->(Beta)\n@enduml')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withLocalDir(path.join(__dirname, '..', 'test'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result.get('nested/testpage.html').content.match(/<svg[^]*<\/svg>/m).toString();
                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('Alpha'), true);
                assert.equal(svg.includes('Beta'), true);
            });
    });
    it('should correctly generate multi puml file', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n(Alpha)->(Beta)\n@enduml\n```\nHello\n```puml\n@startuml\n(Cat)->(Dog)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svgList = result[0].content.match(/<svg[^]*?<\/svg>/gm);
                assert.equal(isSvg(svgList[0]), true);
                assert.equal(svgList[0].includes('Alpha'), true);
                assert.equal(svgList[0].includes('Beta'), true);
                assert.equal(isSvg(svgList[1]), true);
                assert.equal(svgList[1].includes('Cat'), true);
                assert.equal(svgList[1].includes('Dog'), true);
            });
    });
});
