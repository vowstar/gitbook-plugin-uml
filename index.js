var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs-extra');
var crypto = require('crypto');
var plantuml = require('node-plantuml');
var Q = require('q');

var nailgunRunning = false;

var ASSET_PATH = 'assets/images/uml/';

function processBlock(blk) {
    var deferred = Q.defer();

    var book = this;

    var code;
    if (!!blk.kwargs.src) {
        code = fs.readFileSync(blk.kwargs.src , "utf8");
    } else {
        code = blk.body;
    }

    var config = book.config.get('pluginsConfig.uml', {});

    if (blk.kwargs['config']) {
        config = blk.kwargs['config'];
    }

    var format = "png";
    if (config && config.format)
        format = config.format;

    var assetPath = ASSET_PATH;
    var filePath = assetPath + crypto.createHash('sha1').update(code).digest('hex') + '.' + format;

    if (fs.existsSync(filePath)) {
        var result = "<img src=/" + filePath + ">";
        deferred.resolve(result);
    } else {
        var gen = plantuml.generate(code, config);

        var chunks = [];
        gen.out.on('data', function(chunk) {
            chunks.push(chunk)
        })
        gen.out.on('end', function() {
            var buffer = Buffer.concat(chunks)
            fs.mkdirpSync(assetPath);

            fs.writeFile(filePath, buffer, (err) => {
                if (err)
                  console.error(err);
            });

            var result = "<img src=/" + filePath + ">";
            deferred.resolve(result);
        })
    }
    return deferred.promise;
}

module.exports = {
    blocks: {
        uml: {
            process: processBlock
        }
    },
    hooks: {
        // For all the hooks, this represent the current generator
        // [init", "finish", "finish:before", "page", "page:before"] are working.
        // page:* are marked as deprecated because it's better if plugins start using blocks instead.
        // But page and page:before will probably stay at the end (useful in some cases).

        // This is called before the book is generated
        "init": function() {
            if (!Object.keys(this.book.config.get('pluginsConfig.uml', {})).length) {
                var book = this;
                var output = book.output;
                var name = output.name.toString();

                // NOTE: This fixed issue #2
                // https://github.com/vowstar/gitbook-plugin-uml/issues/2
                // Use SVG format by default in website when user not give
                // any configuration to get better result.
                if (name == 'website') {
                    this.book.config.set('pluginsConfig.uml', {
                        format: 'svg'
                    });
                } else {
                    this.book.config.set('pluginsConfig.uml', {
                        format: 'png'
                    });
                }
            }
            var startNailgun = this.book.config.get('pluginsConfig.uml.nailgun', false);
            if (startNailgun && !nailgunRunning) {
                plantuml.useNailgun(function() {
                    nailgunRunning = true;
                });
            }

            // Copy images to output folder every time
            var book = this;
            var output = book.output;
            var rootPath = output.root();
            if (fs.existsSync(ASSET_PATH)) {
                fs.mkdirs(path.join(rootPath, ASSET_PATH));
                fs.copySync(ASSET_PATH, path.join(rootPath, ASSET_PATH));
            }
        },

        // This is called after the book generation
        "finish": function() {
            // Done
        },

        // Before the end of book generation
        "finish:before": function() {
            // NOTE: This fixed issue #7
            // https://github.com/vowstar/gitbook-plugin-uml/issues/7
            // HTML will load after this operation
            // Copy images to output folder every time
            var book = this;
            var output = book.output;
            var rootPath = output.root();
            if (fs.existsSync(ASSET_PATH)) {
                fs.mkdirs(path.join(rootPath, ASSET_PATH));
                fs.copySync(ASSET_PATH, path.join(rootPath, ASSET_PATH));
            }
        },

        // The following hooks are called for each page of the book
        // and can be used to change page content (html, data or markdown)


        // Before parsing documents
        "page:before": function(page) {
            // Get all code texts
            umls = page.content.match(/```(uml|puml|plantuml)((.*[\r\n]+)+?)?```/igm);
            // Begin replace
            if (umls instanceof Array) {
                for (var i = 0, len = umls.length; i < len; i++) {
                    page.content = page.content.replace(
                        umls[i],
                        // Parameter parser for user argument to gitbook argument
                        umls[i].replace(/```(uml|puml|plantuml)[ \t]+{(.*)}/i,
                            function(match, p1, p2) {
                                var newStr = "";
                                var modeQuote = false;
                                var modeArray = false;
                                var modeChar = false;
                                var modeEqual = false;
                                // Trim left and right space
                                var str = p2.replace(/^\s+|\s+$/g,"");

                                // Build new str
                                for(var i = 0; i < str.length; i++){
                                    if (str.charAt(i) == "\"") {
                                        modeQuote = !modeQuote;
                                        modeChar = true;
                                        newStr += str.charAt(i);
                                        continue;
                                    }
                                    if (str.charAt(i) == "[") {
                                        modeArray = true;
                                        newStr += str.charAt(i);
                                        continue;
                                    }
                                    if (str.charAt(i) == "]") {
                                        modeArray = false;
                                        newStr += str.charAt(i);
                                        continue;
                                    }
                                    if (modeQuote || modeArray) {
                                        // In quote, keep all string
                                        newStr += str.charAt(i);
                                    } else {
                                        // Out of quote, process it
                                        if (str.charAt(i).match(/[A-Za-z0-9_]/)) {
                                            modeChar = true;
                                            newStr += str.charAt(i);
                                        } else if (str.charAt(i).match(/[=]/)) {
                                            modeEqual = true;
                                            modeChar = false;
                                            newStr += str.charAt(i);
                                        } else if (modeChar && modeEqual) {
                                            modeChar = false;
                                            modeEqual = false;
                                            newStr += ",";
                                        }
                                    }
                                }

                                newStr = newStr.replace(/,$/,"");

                                return "{% uml " + newStr + " %}";
                            })
                        .replace(/```(uml|puml|plantuml)/i, '{% uml %}')
                        .replace(/```/, '{% enduml %}'));
                }
            }
            return page;
        }
    }
};
