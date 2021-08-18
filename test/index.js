var path = require('path');
var tester = require('honkit-tester');
var assert = require('assert');

var pkg = require('../package.json');

describe('uml', function() {
    it('should correctly replace by ```uml``` tag, mode: svg', function() {
        return tester.builder()
            .withContent('\n```uml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml'],
                pluginsConfig: {
                    uml: {
                        format: "svg",
                        nailgun: false
                    }
                }
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
    it('should correctly replace by ```uml``` tag, mode: png', function() {
        return tester.builder()
            .withContent('\n```uml\n@startuml\n(A)->(B)\n@enduml\n```')
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
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.png';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('PNG'), true);
            });
    });
    it('should correctly replace by ```puml``` tag', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
    it('should correctly replace by ```plantuml``` tag', function() {
        return tester.builder()
            .withContent('\n```plantuml\n@startuml\n(A)->(B)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
    it('should correctly replace by {% uml %} and enduml {% enduml %} tag', function() {
        return tester.builder()
            .withContent('\n{% uml %}\n@startuml\n(A)->(B)\n@enduml\n{% enduml %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
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
                var targetFile = 'assets/images/uml/5e39e6908033eaefb9e853d01eb7f2462a7ea69c.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
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
                var targetFile = 'assets/images/uml/5e39e6908033eaefb9e853d01eb7f2462a7ea69c.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
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
                var targetFile = 'assets/images/uml/b25548fd30f84bae07fd6b18e02a5015fe3531d2.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
    it('should correctly use external plantuml file specified in subdirectory', function() {
        return tester.builder()
            .withPage('nested/testpage','\n```puml\n@startuml\n!include test/test.plantuml\n@enduml\n```')
            .withFile('nested/test/test.plantuml', '@startuml\n(A)->(B)\n@enduml')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withLocalDir(path.join(__dirname, '..', 'test'))
            .withBookJson({
                plugins: ['uml'],
                pluginsConfig: {
                    uml: {
                        format: "svg",
                        nailgun: false
                    }
                }
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/b25548fd30f84bae07fd6b18e02a5015fe3531d2.svg';
                assert(result.get('nested/testpage.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
    it('should correctly generate multi puml file', function() {
        return tester.builder()
            .withContent('\n```puml\n@startuml\n(A)->(B)\n@enduml\n```\nHello\n```puml\n@startuml\n(C)->(D)\n@enduml\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                plugins: ['uml']
            })
            .create()
            .then(function(result) {
                var targetFile = 'assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
                targetFile = 'assets/images/uml/b8d9c8ad9d60d1889365be04217e700042cabc04.svg';
                assert(result.get('index.html').content.includes(targetFile), true);
                assert(result.get(targetFile).content.includes('<polygon fill'), true);
            });
    });
});
