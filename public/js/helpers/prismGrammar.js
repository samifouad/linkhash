export default {
	comment: {
		pattern: /\/\/.*/,
		greedy: true,
	},
	function: /([a-z_][a-z0-9_]+)(?=\()/,
	keyword:
		/\b(use|case|if|@external|@deprecated|fn|import|let|assert|try|pub|type|opaque|const|panic|todo|as)\b/,
	symbol: {
		pattern: /([A-Z][A-Za-z0-9_]+)/,
		greedy: true,
	},
	operator: {
		pattern:
		/(<<|>>|<-|->|\|>|<>|\.\.|<=\.?|>=\.?|==\.?|!=\.?|<\.?|>\.?|&&|\|\||\+\.?|-\.?|\/\.?|\*\.?|%\.?|=)/,
		greedy: true,
	},
	string: {
		pattern: /"((?:[^"\\]|\\.)*)"/,
		greedy: true,
	},
	module: {
		pattern: /([a-z][a-z0-9_]*)\./,
		inside: {
		punctuation: /\./,
		},
		alias: "keyword",
	},
	punctuation: /[.\\:,{}()]/,
	number:
		/\b(?:0b[0-1]+|0o[0-7]+|[[:digit:]][[:digit:]_]*(\\.[[:digit:]]*)?|0x[[:xdigit:]]+)\b/,
};