# gitbook-plugin-uml

[![NPM Version](https://img.shields.io/npm/v/gitbook-plugin-uml.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-uml)
[![Build Status](https://img.shields.io/travis/vowstar/gitbook-plugin-uml/master.svg?style=flat)](https://travis-ci.org/vowstar/gitbook-plugin-uml)
[![NPM Downloads](https://img.shields.io/npm/dm/gitbook-plugin-uml.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-uml)

[PlantUml](http://www.plantuml.com/) Plugin for [GitBook](https://github.com/GitbookIO/gitbook)

This is a sample plugin for GitBook and is specially adapted for GitBook from [PlantUML](http://www.plantuml.com/index.html). Gitbook PlantUml plugin is used to select from markdown uml and converting it into a picture format svg.

## Installation

Gitbook PlantUml plugin can be installed from NPM using:

```bash
$ npm install gitbook-plugin-uml
```

book.json add the plugin

```
{
  "plugins": ["uml"]
}
```

## Features

* Support HTML, PDF, EPUB output(make sure your gitbook support SVG)
* Support `` ``` ``flow code block quote
* Multi code style support


## Beautiful UML

![](./images/uml.png)
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

```
{% uml src="test.plantuml" %}{% enduml %}
```

Of course, you can also pass the parameters like this.

<pre><code>```puml { src="test.plantuml" }
```
</code></pre>

## Configuration

book.json add the uml options

Configure plugin in `book.json`.


```
"pluginsConfig": {
  "uml": {
    format: 'png',
    nailgun: false
  }
}
```

The plugin can be configured to use [Nailgun](http://martiansoftware.com/nailgun/) but by default it does not.

## Build and serve

This plugin only works in your local machine. You need to play with local `gitbook` (command-line tool) to pre-compile all uml images.

```$ gitbook serve yourbook```

or

```$ gitbook build yourbook```

## Additional requirements:

 - Create a directory */assets/images/uml* in the root of your project.
 - [Install PlantUML.](http://www.plantuml.com/download.html) (Download plantuml.jar to root path)

For Mac OS X users. Install *graphviz* package.

```$ brew install graphviz```

For Linux users, Install *graphviz* package.

```$ sudo apt install graphviz```

```$ sudo yum install graphviz```

Debian/Ubuntu users may need install ``default-jre`` prevent Error: spawn java ENOENT.

```$ sudo apt-get install default-jre```

This plugin original from [lyhcode/gitbook-plugin-plantuml](https://github.com/lyhcode/gitbook-plugin-plantuml)
