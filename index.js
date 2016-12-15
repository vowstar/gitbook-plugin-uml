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
    var code = blk.body;
    var config = book.config.get('pluginsConfig.uml', {});

    if (blk.kwargs['config']) {
        config = blk.kwargs['config'];
    }

    var gen = plantuml.generate(code, config);

    var chunks = [];
    gen.out.on('data', function(chunk) {
        chunks.push(chunk)
    })
    gen.out.on('end', function() {
        var buffer = Buffer.concat(chunks)
        var format = "png";
        if (config)
            format = config.format;

        var assetPath = ASSET_PATH;
        var filePath = assetPath + crypto.createHash('sha1').update(code).digest('hex') + '.' + format;

        fs.mkdirpSync(assetPath);

        fs.writeFile(filePath, buffer, (err) => {
            if (err)
                console.error(err);
        });

        var result = "<img src=/" + filePath + ">";
        deferred.resolve(result);
    })
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
                    format: 'png'
                });
            }
            var startNailgun = this.book.config.get('plugins.uml.nailgun', false);
            if (startNailgun && !nailgunRunning) {
                plantuml.useNailgun(function() {
                    nailgunRunning = true;
                });
            }
        },

        // This is called after the book generation
        "finish": function() {
            // Done
        },

        // Before the end of book generation
        "finish:before": function() {
            // Copy images to output folder every time
            var book = this;
            var output = book.output;
            var rootPath = output.root();
            if (fs.existsSync(ASSET_PATH)) {
                fs.mkdirs(path.join(rootPath, ASSET_PATH));
                // fs.copy(ASSET_PATH, path.join(rootPath, ASSET_PATH), {
                //     clobber: true
                // }, function(err) {
                //     if (err)
                //         console.error(err)
                // })
                fs.copySync(ASSET_PATH, path.join(rootPath, ASSET_PATH));
            }
        },

        // The following hooks are called for each page of the book
        // and can be used to change page content (html, data or markdown)


        // Before parsing documents
        "page:before": function(page) {
            // Get all code texts
            umls = page.content.match(/^```uml((.*\n)+?)?```$/igm);
            // Begin replace
            if (umls instanceof Array) {
                for (var i = 0, len = umls.length; i < len; i++) {
                    page.content = page.content.replace(
                        umls[i],
                        umls[i].replace(/^```uml/, '{% uml %}').replace(/```$/, '{% enduml %}'));
                }
            }
            return page;
        }
    }
};