/**
 *  Format a string containing (valid) js variables into proper JSON so it can be handled by JSON.parse
 *  @package    JSONFormatter
 *  @author     Rogier Spieker <rogier@konfirm.eu>
 */
function JSONFormatter() {
	//  Implement a Singleton pattern and allow JSONFormatter to be invoked without the `new` keyword
	if (typeof JSONFormatter.prototype.__instance !== 'undefined' || !(this instanceof JSONFormatter)) {
		return JSONFormatter.prototype.__instance || new JSONFormatter();
	}
	JSONFormatter.prototype.__instance = this;

	var formatter = this,
		special = '\'":,{}[] ',
		pattern = {
			escape: /["\\\/\b\f\n\r\t]/,
			noquote: /^(?:true|false|null|-?[0-9]+(?:\.[0-9]+)?)$/i,
			trailer: /[,]+$/
		};

	/**
	 *  Determine is a token is a special character
	 *  @name    isSpecial
	 *  @access  internal
	 *  @param   string  token
	 *  @return  bool  special
	 */
	function isSpecial(token) {
		return special.indexOf(token) >= 0;
	}

	/**
	 *  Add quotes if required
	 *  @name    addQuotation
	 *  @access  internal
	 *  @param   string  token
	 *  @param   bool    force
	 *  @return  string  JSON-token
	 */
	function addQuotation(token, force) {
		var quote = '"';

		//  if quotation is not enforced, we must skip application of quotes for certain tokens
		if (!force && (isSpecial(token) || pattern.noquote.test(token))) {
			quote = '';
		}

		return quote + token + quote;
	}

	/**
	 *  Remove trailing commas from the result stack
	 *  @name    removeTrailing
	 *  @access  internal
	 *  @param   Array  result
	 *  @return  void
	 *  @note    This manipulates the provided array
	 */
	function removeTrailing(result) {
		return pattern.trailer.test(result) ? removeTrailing(result.substr(-1)) : result;
	}

	/**
	 *  Handle a quoted string, ensuring proper escaping for double quoted strings
	 *  @name    escapeQuotedInput
	 *  @access  internal
	 *  @param   string  token
	 *  @array   Array   list
	 *  @return  Array   result
	 */
	function escapeQuotedInput(token, list) {
		var quote = '"',
			result = [],
			character;

		while (list.length) {
			character = list.shift();

			//  reduce provided escaping
			if (character[character.length - 1] === '\\') {
				if (!pattern.escape.test(list[0])) {
					//  remove the escape character
					character = character.substr(0, character.length - 1);
				}

				//  add the result
				result.push(character);

				//  while we are at it, we may aswel move the (at least previously) escaped
				//  character to the result
				result.push(list.shift());
				continue;
			}
			else if (character === token) {
				//  with the escaping taken care of, we now know the string has ended
				break;
			}
			else if (character === quote) {
				character = '\\' + character;
			}

			result.push(character);
		}

		return addQuotation(result.join(''), true);
	}

	/**
	 *  Compile the JSON-formatted string from a list of 'tokenized' data
	 *  @name    compile
	 *  @access  internal
	 *  @param   Array   list
	 *  @return  string  JSON-formatted
	 */
	function compile(list) {
		var result = '',
			token;

		while (list.length) {
			token = list.shift();

			switch (token) {
				//  ignore whitespace outside of quoted patterns
				case ' ':
					break;

				//  remove any trailing commas and whitespace
				case '}':
				case ']':
					result = removeTrailing(result) + token;
					break;

				//  add/remove escaping
				case '"':
				case '\'':
					result += escapeQuotedInput(token, list);
					break;

				//  determine if the value needs to be quoted (always true if the next item in the list is a separator)
				default:
					result += addQuotation(token, list[0] === ':');
					break;
			}
		}

		return result;
	}

	/**
	 *  Tokenize the input, adding each special character to be its own item in the resulting array
	 *  @name    tokenize
	 *  @access  internal
	 *  @param   string  input
	 *  @result  Array   tokens
	 */
	function tokenize(input) {
		var result = [],
			i;

		//  check each character in the string
		for (i = 0; i < input.length; ++i) {
			//  if there is not result or the current or previous input is special, we create a new result item
			if (result.length === 0 || isSpecial(input[i]) || isSpecial(result[result.length - 1])) {
				result.push(input[i]);
			}
			//  extend the previous item
			else {
				result[result.length - 1] += input[i];
			}
		}

		return result;
	}

	/**
	 *  Prepare a string to become a JSON-representation
	 *  @name    prepare
	 *  @access  public
	 *  @param   string  input
	 *  @return  string  JSON-formatted
	 */
	formatter.prepare = function(input) {
		//  tokenize the input and feed it to the compiler in one go
		return compile(tokenize(input))
			//  determine whether we are dealing with an Object or Array notation
			.replace(/^.*?([:,]).*$/, function(match, symbol) {
				var character = symbol === ':' ? '{}' : '[]';

				//  figure out if the notation should be added or may be skipped
				return match[0] !== character[0] ? character[0] + match + character[1] : match;
			})
		;
	};

	/**
	 *  Prepare a string and parse it using JSON.parse
	 *  @name    parse
	 *  @access  public
	 *  @param   string  input
	 *  @return  mixed   parsed
	 */
	formatter.parse = function(input) {
		return JSON.parse(formatter.prepare(input));
	};
}
