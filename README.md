# JSONFormatter
Format a string containing (valid) js variables into proper JSON so it can be handled by JSON.parse


## Concept
For a project it was desired to be able to have settings/logic in HTML-attributes which interpreted by javascript. In order to prevent having to resort to `eval` and `new Function` solutions, while still enabling a simplified JSON-like notation, this small library was created.


## Benefits
With every bit of added processing an bit of performance is lost, so there must be a good reason not to be using `eval` and `new Function`

### `Content-Security-Policy` (CSP) header
In modern browsers on of the extra security features that can (and should) be leveraged is the `Content-Security-Policy`-header, these headers tell the browser which resources are allowed to be obtained/accessed.

If you're not yet familiar with CSP there is a lot of information on this topic available at [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Introducing_Content_Security_Policy), [content-security-policy.com](http://content-security-policy.com) and there's a great introduction article by [html5rocks.com](http://www.html5rocks.com/en/tutorials/security/content-security-policy/).

### Relaxed configuration for developers
While it would have been perfectly valid option to require developers to write their configuration in the HTML-attributes, it proved to be quite cumbersome and more importantly, error prone.

For example, one could easily forget en escape character

```
<div data-config="{\"hello\":\"world\"}">...</div>
```

We've eliminated the requirement of the quotation marks, for both keys _and_ values (and with that, a large chunk of pesky escaping):

```
<div data-config="{hello:world}">...</div>
```

And as objects, arrays, keys and values had to be distinguished anyway, the requirement for any outer brackets/braces was also eliminated.

```
<div data-config="hello:world">...</div>
```


## Usage
`JSONFormatter` implements the singleton pattern and it allows to be called as function without the `new` keyword, so all invocations are to be providing the exact same instance.

```
var a = new JSONFormatter(),
	b = JSONFormatter(),
	c = new JSONFormatter(),
	d = JSONFormatter();

console.log(a === b, b === c, c === d, d === a);  //  true true true true
```

### `mixed JSONFormatter.parse(string input)`
The purpose of JSONFormatter is to parse strings into the types they describe, here's how to do this:

```
var config = JSONFormatter().parse('hello:world');

console.log(config);
//  config now contains an object with the key 'hello', which in turn contains the value 'world'
//  as you've written:
//  config = JSON.parse('{"hello":"world"}');
//  or
//  config = {hello:'world'};
```

### `string JSONFormatter.prepare(string input)`
Whether you're curious or trying to debug some strange behaviour, the `prepare` method provides the actual JSON formatted string.

```
var formatted = JSONFormatter().prepare('hello:world');

console.log(formatted);  //  '{"hello":"world"}'
```


## Issues
Feel free to submit [issues and enhancement requests](https://github.com/rspieker/json-formatter/issues)

## Contributing
Pull requests are more than welcome, GitHub makes this very easy:
- Create an issue describing the change you are thinking of (it would be awkward if some else is working on the same thing)
- Fork the [repository](https://github.com/rspieker/json-formatter)
- Create a branch (use a concice and descriptive name)
- Work on your change(s) and commit them
- Create a pull request with your changes

There is a pretty good [tutorial on creating pull-requests](https://help.github.com/articles/using-pull-requests/)
