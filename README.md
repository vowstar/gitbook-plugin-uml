# gitbook-plugin-uml

[![Build Status](https://img.shields.io/travis/vowstar/gitbook-plugin-uml/master.svg?style=flat)](https://travis-ci.org/vowstar/gitbook-plugin-uml)
[![Coverage Status](https://coveralls.io/repos/github/vowstar/gitbook-plugin-uml/badge.svg?branch=master)](https://coveralls.io/github/vowstar/gitbook-plugin-uml?branch=master)
[![NPM Version](https://img.shields.io/npm/v/gitbook-plugin-uml.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-uml)
[![Dependencies Status](https://david-dm.org/vowstar/gitbook-plugin-uml/status.svg)](https://david-dm.org/vowstar/gitbook-plugin-uml/)
[![DevDependencies Status](https://david-dm.org/vowstar/gitbook-plugin-uml/dev-status.svg)](https://david-dm.org/vowstar/gitbook-plugin-uml/#info=devDependencies)
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

book.json add the plugin

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

![UML](./images/uml.png)
**Image of uml**

## How to use it

To include a PlantUML diagram, just wrap your definition in a "uml" code block. For example:

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

```
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
$ gitbook serve yourbook
```

or

```terminal
$ gitbook build yourbook
```

## Additional requirements:

* Create a directory */assets/images/uml* in the root of your project.

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

This plugin original from [lyhcode/gitbook-plugin-plantuml](https://github.com/lyhcode/gitbook-plugin-plantuml)
