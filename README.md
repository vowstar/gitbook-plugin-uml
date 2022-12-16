# gitbook-plugin-uml

[![Build Status](https://github.com/vowstar/gitbook-plugin-uml/actions/workflows/test.yml/badge.svg)](https://github.com/vowstar/gitbook-plugin-uml/actions)
[![Coverage Status](https://coveralls.io/repos/github/vowstar/gitbook-plugin-uml/badge.svg?branch=master)](https://coveralls.io/github/vowstar/gitbook-plugin-uml?branch=master)
[![NPM Version](https://img.shields.io/npm/v/gitbook-plugin-uml.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-uml)
[![NPM Downloads](https://img.shields.io/npm/dm/gitbook-plugin-uml.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-uml)

[PlantUml](http://www.plantuml.com/) Plugin for [Honkit](https://github.com/honkit/honkit) ~~and [GitBook](https://github.com/GitbookIO/gitbook)~~.

This is a sample plugin for ~~GitBook~~ Honkit and is specially adapted for ~~GitBook~~ Honkit from [PlantUML](http://www.plantuml.com/index.html). ~~Gitbook~~ Honkit PlantUml plugin is used to select from markdown uml and converting it into a picture format svg.

## Installation

Install honkit instead of gitbook-cli(deprecated).

Install JRE or JDK please. Ensure your system have java.

It will download plantuml jar file automatically, so in some country and region you must install it behind a proxy, or it will download fail.

Gitbook PlantUml plugin can be installed from NPM using:

```bash
npm install gitbook-plugin-uml
```

Add this plugin into ``book.json``.

```json
{
  "plugins": ["uml"]
}
```

## FAQ

Important:

** Please ensure your system have java!!! Or this plugin may not work, and get ```Error: spawn java ENOENT```

** It will download plantuml jar file automatically, so in some country and region you must install it behind a proxy, or it will download fail.

## Features

* Support HTML, PDF, EPUB output(make sure your gitbook support SVG)
* Support `` ``` ``flow code block quote
* Multi code style support

## Beautiful UML

![ARCHIMATE](http://www.plantuml.com/plantuml/png/fLLDRzim33rFlqBeXc4Ru0uOi4kH1VNIjScXdR40EVN2saoYrQ8CIMvNRFtle-puAqk3fiiX2KNoYO-ao5FdmVfIvyBTAYh0WfOMKm-qod4qki4rt2bZnsFvMxoofgHiOYoXbPy-YqVX2giyoZStYJKfEYT_WZq1cwwL1eyVRqgdY8-ZebQtzZ17UwTItBA7eiXL2buPYbnjqRbCZ2uC8VazJcbZ8qHBGXvDWJB-JNDG-aXAS78waQDH6_LuF23w-kicx3x610fVMfGpMXghgzjggCdiKAWhuzNouPhYB5C11t8vzt2BQvDdQDrHGBsAvuV2BY1N6IUaybySwZsZEtHUhHg0Wraby50v9izo55o13r5cxYdY3FObPjuN5trXO9W8mRcFh5gjVSJWmJ6ahJjPY4LFcec-TJBea7aAH8fM5GEt4GAHfb6tYSHTqmswf7JUQ7uTa6bIpjjDep1gkb75cLQTwYLtX3Pskswe5F-BdrX5_aNikGDqU9xFT1HjdgEoYCQX3Px8KSzW5yLQ6yg_HxtOfvo99lPQvkPeqz2uRnqC--VCf6NmlwPB85XX_N_-u3pggZPdbzLxxeROdW9V8CzNoAzfykDo0CBoFo1FeamvaVAjZE-1HqrYsAGQENts5UWqJk9dXpO0FLS4bAeGwIxSynsuMnqGid9S5iT_nksZwvyrAHU1-EPiTuk8YaLZigFGeWgdmQsBBKIEAwHCvhZqujilq0LpN5gZfLypsJYi65TQ9idB0nnAvykCfzoxxmNI1I_3ulsnc2EAB_mHlQadJvhD9vlDjp5f7uOyaRt59PjjrvXrITiox3OSXgKMuXUd_1Ks-5y0)

![WAVEFORM](http://www.plantuml.com/plantuml/png/VP5H2vim4CVVxrCSxd6K6QM3oHYkjDrx7zR74SsjXgPQabYxRx-SjaOPJ13k_lVB_tANqdbfVNypu6ff2BSe7OfjYdVz9EC0QjFLLwpD5GVj6xoJrPr20PLkfVs32RMoCfJmCMfdzVJfF4fsc2KblSIVqcWrLjG3wgwjjQEfjElTf5THbqfPSWwhLurpWF8pnyLWjQTV5LsW5Eb2eLP1aBQZP4cg5_Cb2em49WLgKJiqtG2guYX9dsa2tEQTvRyJiCDCFJXAmzdOVfC3JZwDlZIhIWOu--uFt_Uxm-6Oh0ZniXHBbHk-xRXLd6jzaobQr3yA9lu_KPOdl9wC7UOxYppYn_0nagtM4zjbOcKDx632xp5EWBvRF0T--D4PLPmvZ_Zq5ZFDoGIFrPtfgJW53KAtrSRmw-ORBeR60Xtv_evUt-WVEB0y_6f9uKGJBWHboFgR-Gi0)

## How to use it

To include a PlantUML diagram, just wrap your definition in a "uml" code block. For example:

![UML](./images/uml.png)

*Text format uml:*

<pre><code>```uml
@startuml

	Class Stage
	Class Timeout {
		+constructor:function(cfg)
		+timeout:function(ctx)
		+overdue:function(ctx)
		+stage: Stage
	}
 	Stage &lt;|-- Timeout

@enduml
```
</code></pre>

And what's more, ```puml``` and ```plantuml``` code block also OK.

<pre><code>```puml
@startuml

	Class Stage
	Class Timeout {
		+constructor:function(cfg)
		+timeout:function(ctx)
		+overdue:function(ctx)
		+stage: Stage
	}
 	Stage &lt;|-- Timeout

@enduml
```
</code></pre>

Also you can put in your book block as

```markdown
{% uml %}
@startuml

	Class Stage
	Class Timeout {
		+constructor:function(cfg)
		+timeout:function(ctx)
		+overdue:function(ctx)
		+stage: Stage
	}
 	Stage &lt;|-- Timeout

@enduml
{% enduml %}
```

The block syntax also allows for a `src` attribute to import an external PlantUml file.

```text
{% uml src="test.plantuml" %}{% enduml %}
```

Of course, you can also pass the parameters like this.

<pre><code>```puml { src="test.plantuml" }
```
</code></pre>

## Configuration

book.json add the uml options

Configure plugin in `book.json`.

```json
"pluginsConfig": {
  "uml": {
    "format": "png",
    "nailgun": false
  }
}
```

## Build and serve

This plugin only works in your local machine. You need to play with local `gitbook` (command-line tool) to pre-compile all uml images.

```terminal
gitbook serve yourbook
```

or

```terminal
gitbook build yourbook
```

## Additional requirements

For Mac OS X users. Install *graphviz* package.

```bash
brew install graphviz
```

For Linux users, Install *graphviz* package.

```bash
sudo apt install graphviz
```

```bash
sudo yum install graphviz
```

Debian/Ubuntu users may need install ``default-jre`` prevent Error: spawn java ENOENT.

```bash
sudo apt-get install default-jre
```

## Thanks

This plugin original from [lyhcode/gitbook-plugin-plantuml](https://github.com/lyhcode/gitbook-plugin-plantuml)

## See also

These plugins are also available on honkit.

|                                    Plugin                                     |                      Description                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| [gitbook-plugin-uml](https://github.com/vowstar/gitbook-plugin-uml)           | A plug-in that use plantuml to draw beautiful pictures |
| [gitbook-plugin-wavedrom](https://github.com/vowstar/gitbook-plugin-wavedrom) | A plug-in that can draw waveforms and register tables  |
| [gitbook-plugin-sequence](https://github.com/vowstar/gitbook-plugin-sequence) | A plug-in that can draw sequence diagrams              |
| [gitbook-plugin-flow](https://github.com/vowstar/gitbook-plugin-flow)         | A plug-in that can draw flowchart.js diagrams          |
| [gitbook-plugin-echarts](https://github.com/vowstar/gitbook-plugin-echarts)   | A plug-in that can draw various charts such as bar/pie |
