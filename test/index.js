var path = require('path');
var tester = require('gitbook-tester');
var assert = require('assert');

var pkg = require('../package.json');

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
                assert.equal(result[0].content, '<p><img src="assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.png"></p>')
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
                assert.equal(result[0].content, '<p><img src="assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.png"></p>')
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
                assert.equal(result[0].content, '<p><img src="assets/images/uml/39e6cfed5bc41c359e02bb07bcfcbcb365bd61eb.png"></p>')
            });
    });
});
