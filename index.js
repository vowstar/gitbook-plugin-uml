/*jshint esversion: 8 */

const path = require('path');
const fs = require('fs');
const plantuml = require('node-plantuml-back');

let nailgunRunning = false;

function processBlock(blk) {
    return new Promise((resolve, reject) => {
        const book = this;

        let code;
        if (!!blk.kwargs.src) {
            code = fs.readFileSync(blk.kwargs.src, "utf8");
        } else {
            code = blk.body;
        }

        let config = blk.kwargs.config || this.book.config.get('pluginsConfig.uml', {});

        config.format = config.format || "svg";
        config.charset = config.charset || "utf8";
        config.config = config.config || "classic";

        if (this.ctx && this.ctx.ctx && this.ctx.ctx.file && this.ctx.ctx.file.path) {
            const includePath = path.resolve(path.dirname(this.ctx.ctx.file.path));
            const cwdPath = require("process").cwd();
            config.include = (includePath === cwdPath) ? `${includePath}:${cwdPath}` : `${includePath}${process.platform === 'win32' ? ';' : ':'}${cwdPath}`;
        }

        const gen = plantuml.generate(code, config);

        const chunks = [];
        gen.out.on('data', chunk => {
            chunks.push(chunk);
        });
        gen.out.on('end', () => {
            const buffer = Buffer.concat(chunks);
            let result;
            if (config.format === 'ascii' || config.format === 'unicode') {
                result = buffer.toString(config.charset)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;")
                    .replace(/\n/g, "<br>")
                    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                    .replace(/ /g, "&nbsp;");
            } else if (config.format === 'svg') {
                result = buffer.toString(config.charset);
            } else {
                result = `<img src="data:image/png;base64,${buffer.toString("base64")}">`;
            }
            resolve(result);
        });

        gen.out.on('error', error => {
            reject(error);
        });
    });
}

module.exports = {
    blocks: {
        uml: {
            process: processBlock
        }
    },
    hooks: {
        "init": function() {
            if (!Object.keys(this.book.config.get('pluginsConfig.uml', {})).length) {
                this.book.config.set('pluginsConfig.uml', {
                    format: 'svg',
                    charset: 'utf8',
                    config: 'classic',
                    nailgun: false
                });
            }

            const config = this.book.config.get('pluginsConfig.uml', {});

            if (!config.format) {
                config.format = this.honkit || this.output.name === 'website' ? 'svg' : 'png';
            }

            config.charset = config.charset || 'utf8';
            config.config = config.config || 'classic';
            config.nailgun = config.nailgun || false;

            this.book.config.set('pluginsConfig.uml', config);

            if (config.nailgun && !nailgunRunning) {
                plantuml.useNailgun(() => {
                    nailgunRunning = true;
                });
            }
        },

        "finish": function() {},

        "finish:before": function() {},

        "page:before": function(page) {
            let umls = page.content.match(/```(\x20|\t)*(uml|puml|plantuml)((.*[\r\n]+)+?)?```/igm);
            if (Array.isArray(umls)) {
                for (let i = 0; i < umls.length; i++) {
                    page.content = page.content.replace(
                        umls[i],
                        umls[i].replace(/```(\x20|\t)*(uml|puml|plantuml)[ \t]+{(.*)}/i, matchedStr => {
                            let newStr = "";
                            let modeQuote = false;
                            let modeArray = false;
                            let modeChar = false;
                            let modeEqual = false;
                            let str = matchedStr.replace(/^\s+|\s+$/g, "").replace(/```(\x20|\t)*(uml|puml|plantuml)/i, "");

                            for (let j = 0; j < str.length; j++) {
                                if (str.charAt(j) === "\"") {
                                    modeQuote = !modeQuote;
                                    modeChar = true;
                                    newStr += str.charAt(j);
                                    continue;
                                }
                                if (str.charAt(j) === "[") {
                                    modeArray = true;
                                    newStr += str.charAt(j);
                                    continue;
                                }
                                if (str.charAt(j) === "]") {
                                    modeArray = false;
                                    newStr += str.charAt(j);
                                    continue;
                                }
                                if (modeQuote || modeArray) {
                                    newStr += str.charAt(j);
                                } else {
                                    if (/[A-Za-z0-9_]/.test(str.charAt(j))) {
                                        modeChar = true;
                                        newStr += str.charAt(j);
                                    } else if (str.charAt(j) === "=") {
                                        modeEqual = true;
                                        modeChar = false;
                                        newStr += str.charAt(j);
                                    } else if (modeChar && modeEqual) {
                                        modeChar = false;
                                        modeEqual = false;
                                        newStr += ",";
                                    }
                                }
                            }

                            return `{% uml ${newStr.replace(/,$/, "")} %}`;
                        })
                        .replace(/```(\x20|\t)*(uml|puml|plantuml)/i, '{% uml %}')
                        .replace(/```/, '{% enduml %}')
                    );
                }
            }
            return page;
        },

        "page": function(page) {
            return page;
        }
    }
};
