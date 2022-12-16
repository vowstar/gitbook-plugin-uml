/*jshint esversion: 8 */

var path = require('path');
var fs = require('fs');
var plantuml = require('node-plantuml-back');
var Q = require('q');

var nailgunRunning = false;

function processBlock(blk) {
    var deferred = Q.defer();

    var book = this;

    var code;
    if (!!blk.kwargs.src) {
        code = fs.readFileSync(blk.kwargs.src , "utf8");
    } else {
        code = blk.body;
    }

    var config;

    if (!!blk.kwargs.config) {
        config = blk.kwargs.config;
    } else {
        config = this.book.config.get('pluginsConfig.uml', {});
    }

    if (!config.format) {
        config.format = "svg";
    }
    if (!config.charset) {
        config.charset = "utf8";
    }
    if (!config.config) {
        config.config = "classic";
    }

    if (this.ctx && this.ctx.ctx && this.ctx.ctx.file && this.ctx.ctx.file.path) {
        var includePath = path.resolve(path.dirname(this.ctx.ctx.file.path));
        var cwdPath = require("process").cwd();
        if (includePath == cwdPath) {
            config.include = includePath + ':' + cwdPath;
        } else {
            if (require("process").platform == 'win32') {
                config.include = includePath + ';' + cwdPath;
            } else {
                config.include = includePath + ':' + cwdPath;
            }
        }
    }

    var gen = plantuml.generate(code, config);

    var chunks = [];
    gen.out.on('data', function(chunk) {
        chunks.push(chunk);
    });
    gen.out.on('end', function() {
        var buffer = Buffer.concat(chunks);
        var result;
        if (config.format == 'ascii' || config.format == 'unicode') {
            result = buffer.toString(config.charset)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/\n/g, "<br>")
                .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/ /g, "&nbsp;");
        } else if (config.format == 'svg') {
            result = buffer.toString(config.charset);
        } else {
            // process config.format == 'png'
            result = `<img src="data:image/png;base64,${buffer.toString("base64")}">`;
        }

        deferred.resolve(result);
    });

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
                this.book.config.set('pluginsConfig.uml', {
                    format: 'svg',
                    charset: 'utf8',
                    config: 'classic',
                    nailgun: false
                });
            }

            var config = this.book.config.get('pluginsConfig.uml', {});

            if (!config.format) {
                // Auto select svg or png
                if (this.honkit) {
                    // honkit support svg better, so use svg
                    config.format = 'svg';
                } else {
                    // NOTE: This fixed issue #2
                    // https://github.com/vowstar/gitbook-plugin-uml/issues/2
                    // Use SVG format by default in website when user not give
                    // any configuration to get better result.
                    if (this.output.name != 'website') {
                        // gitbook pdf not support svg
                        config.format = 'png';
                    } else {
                        config.format = 'svg';
                    }
                }
            }

            if (!config.charset) {
                config.charset = 'utf8';
            }
            if (!config.config) {
                config.config = 'classic';
            }
            if (!config.nailgun) {
                config.nailgun = false;
            }

            this.book.config.set('pluginsConfig.uml', config);

            var startNailgun = this.book.config.get('pluginsConfig.uml.nailgun', false);
            if (startNailgun && !nailgunRunning) {
                plantuml.useNailgun(function() {
                    nailgunRunning = true;
                });
            }
        },

        // This is called after the book generation
        "finish": function() {
            // This is called after the book generation
        },

        // This is called before the end of book generation
        "finish:before": function() {
            // This is called before the end of book generation
        },

        // The following hooks are called for each page of the book
        // and can be used to change page content (html, data or markdown)

        // This is called before parsing documents
        "page:before": function(page) {
            // Get all code texts
            umls = page.content.match(/```(\x20|\t)*(uml|puml|plantuml)((.*[\r\n]+)+?)?```/igm);
            // Begin replace
            if (umls instanceof Array) {
                for (var i = 0, len = umls.length; i < len; i++) {
                    page.content = page.content.replace(
                        umls[i],
                        // Parameter parser for user argument to gitbook argument
                        umls[i].replace(/```(\x20|\t)*(uml|puml|plantuml)[ \t]+{(.*)}/i,
                            function(matchedStr) {
                                var newStr = "";
                                var modeQuote = false;
                                var modeArray = false;
                                var modeChar = false;
                                var modeEqual = false;
                                // Trim left and right space
                                var str = matchedStr.replace(/^\s+|\s+$/g,"");
                                // Remove ```(uml|puml|plantuml) header
                                str = str.replace(/```(\x20|\t)*(uml|puml|plantuml)/i, "");

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
                        .replace(/```(\x20|\t)*(uml|puml|plantuml)/i, '{% uml %}')
                        .replace(/```/, '{% enduml %}')
                    );
                }
            }
            return page;
        },

        // This is called when page html generation
        "page": function(page) {
            // This is called when page html generation
            return page;
        }
    }
};
