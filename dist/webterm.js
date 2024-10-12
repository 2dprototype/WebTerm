class WebTerm {
	constructor(parent){
		this.foregroundColors = {
			'30': '#2e3436',
			'31': '#cc0000',
			'32': '#4e9a06',
			'33': '#c4a000',
			'34': '#3465a4',
			'35': '#75507b',
			'36': '#06989a',
			'37': '#d3d7cf',
			'90': '#555753',
			'91': '#ef2929',
			'92': '#8ae234',
			'93': '#fce94f',
			'94': '#729fcf',
			'95': '#ad7fa8',
			'96': '#34e2e2',
			'97': '#eeeeee'
		}
		this.backgroundColors = {
			'40': '#2e3436',
			'41': '#cc0000',
			'42': '#4e9a06',
			'43': '#c4a000',
			'44': '#3465a4',
			'45': '#75507b',
			'46': '#06989a',
			'47': '#d3d7cf',
			'100': '#555753',
			'101': '#ef2929',
			'102': '#8ae234',
			'103': '#fce94f',
			'104': '#729fcf',
			'105': '#ad7fa8',
			'106': '#34e2e2',
			'107': '#eeeeee'
		}
		this.styles = {
			'1': 'bold',
			'3': 'italic',
			'4': 'underline'
		}
		this._enableAnsiColor = true
		var ref = this
		this.onwrite = null
		this.element = document.createElement("div")
		this.element.setAttribute("class", "webterm")	
		this.content = document.createElement("pre")
		this.content.setAttribute("class", "content")
		this.element.appendChild(this.content)
		this.writer = document.createElement("pre")
		this._writer = document.createElement("input")
		this.element.appendChild(this.writer)
		this.element.appendChild(this._writer)
		this._cursorColor = "#eeeeee"
		this._history = []
		this._currentLine = 0
		
		this.element.onkeydown = function(e) {
			ref._updateWriter(ref._writer.value)
		}
		this.element.onkeyup = function(e) {
			ref._updateWriter(ref._writer.value)
		}
		// this.element.onfocus = function(e) {
			// console.log(e)
		// }
		this._writer.onkeydown = function(e) {
			if (e.keyCode == 13) {
				if (typeof ref.onwrite == "function") {
					ref.onwrite(this.value)
					if (this.value.length > 0) ref._history.push(this.value)
					ref._currentLine = ref._history.length
				}
				this.value = ""
				ref._updateWriter("")
			}
			else if (e.keyCode == 38) {
				e.preventDefault()
				if (ref._currentLine > 0) {
					ref._currentLine--
					ref._writer.value = ref._history[ref._currentLine]
				}
			}
			else if (e.keyCode == 40) {
				e.preventDefault()
				if (ref._currentLine < ref._history.length-1) {
					ref._currentLine++
					ref._writer.value = ref._history[ref._currentLine]
				}
			}
		}	
		
		this.element.onclick = function(e) {
			ref._writer.focus()
			ref._writer.selectionStart = ref._writer.value.length-1
			ref._updateWriter(ref._writer.value)
		}
		
		this._initDisplay()
		
		if (parent) parent.appendChild(this.element)
	}
	_scrollBottom(){
		this.element.scrollTop = this.element.scrollHeight
	}
	_updateWriter(text){
		text = text + " "
		this.writer.innerHTML = ""
		for (let i in text) {
			let t = text[i]
			let span = document.createElement("span")
			span.innerText = t
			if (i == this._writer.selectionStart) {
				span.style.backgroundColor = this._cursorColor
				span.style.color = this.element.style.backgroundColor
			}
			this.writer.appendChild(span)
		}	
	}
	_initDisplay() {
		// this._writer.style.width = '0'
		this._writer.style.height = '1'
		this._writer.style.backgroundColor = 'transparent'
		this._writer.style.color = 'transparent'
		this._writer.style.border = 'none'
		this._writer.style.outline = 'none'
		this._writer.style.position = "relative"
		this._writer.style.zIndex = "-100"
		
	    this.element.style.width = "100%"
        this.element.style.height = "100%"
        this.element.style.backgroundColor = "#101010"
        this.element.style.position = "absolute"
        this.element.style.color = "#eeeeee"
        this.element.style.fontFamily = '"Roboto Mono", monospace'
        this.element.style.overflowY = "auto"
        this.element.style.overflowX = "hidden"
        this.element.style.fontSize = '1em'
        this.element.style.wordWrap = 'break-word'
		
		this.content.style.display = "inline"
		this.content.style.margin = "0"
		this.content.style.padding = "0"
		this.content.style.tabSize = "1em"	
		this.content.style.position = "relative"
		this.content.style.zIndex = "100"
		this.content.style.whiteSpace = 'pre-wrap'
		
		this.writer.style.display = "inline"
		this.writer.style.margin = "0"
		this.writer.style.padding = "0"
		this.writer.style.tabSize = "1em"
		this.writer.style.position = "relative"
		this.writer.style.zIndex = "100"
		this.writer.style.whiteSpace = 'pre-wrap'
	}
	clear(){
		this.content.innerHTML = ""
	}
	enableAnsiColor(b){
		this._enableAnsiColor = b
	}
	setCursorColor(color) {
	    this._cursorColor = color
	}
	setColor(color) {
	    this.element.style.color = color
	}	
	setBackgroundColor(color) {
	   this.element.style.backgroundColor = color
	}	
	setSize(width, height) {
	    this.element.style.width = width
        this.element.style.height = height
	}	
	setFontFamily(family) {
	    this.element.style.fontFamily = family
	}
	setFontSize(size) {
	    this.writer.style.tabSize = size
        this.content.style.tabSize = size
		this.element.style.fontSize = size
	}
	clearHistory(){
		this._history = []
		this._currentLine = 0
	}
	write(__text){
		if (this._enableAnsiColor) {
			let texts = this._parseAnsi(__text)
			for (let t of texts) {
				let span = document.createElement("span")
				span.innerText = t.text
				if (t.foreground) span.style.color = t.foreground
				if (t.background) span.style.backgroundColor = t.background
				if (t.italic) span.style.fontStyle = 'italic'
				if (t.underline) span.style.textDecoration = 'underline'
				if (t.bold) span.style.fontWeight = 'bold'
				this.content.append(span)
			}
		}
		else {
			let span = document.createElement("span")
			span.innerText = __text
			this.content.append(span)
		}
		this._scrollBottom()
	}
	writeln(text){
		this.write(text)
		this.content.append(document.createElement("br"))
	}
	_parseAnsi(str) {
		var ref = this
		let matchingControl = null
		let matchingData = null
		let matchingText = ''
		let ansiState = []
		let result = []
		let state = {}
			
		function eraseChar() {
			var index, text;
			if (matchingText.length) {
				matchingText = matchingText.substr(0, matchingText.length - 1);
			} 
			else if (result.length) {
				index = result.length - 1;
				text = result[index].text;
				if (text.length === 1) {
					result.pop();
				} 
				else {
					result[index].text = text.substr(0, text.length - 1);
				}
			}
		};

		for (var i = 0; i < str.length; i++) {
			if (matchingControl != null) {
				if (matchingControl == '\u001B' && str[i] == '\[') {
					if (matchingText) {
						state.text = matchingText;
						result.push(state);
						state = {};
						matchingText = "";
					}

					matchingControl = null;
					matchingData = '';
				} 
				else {
					matchingText += matchingControl + str[i];
					matchingControl = null;
				}
				continue;
			} 
			else if (matchingData != null) {
				if (str[i] == ';') {
					ansiState.push(matchingData);
					matchingData = ''
				} 
				else if (str[i] == 'm') {
					ansiState.push(matchingData);
					matchingData = null
					matchingText = ''
					ansiState.forEach(function (ansiCode) {
						if (ref.foregroundColors[ansiCode]) {
							state.foreground = ref.foregroundColors[ansiCode];
						}
						else if (ref.backgroundColors[ansiCode]) {
							state.background = ref.backgroundColors[ansiCode];
						} 
						else if (ansiCode == 39) {
							delete state.foreground;
						} 
						else if (ansiCode == 49) {
							delete state.background;
						} 
						else if (ref.styles[ansiCode]) {
							state[ref.styles[ansiCode]] = true
						} 
						else if (ansiCode == 22) {
							state.bold = false
						} 
						else if (ansiCode == 23) {
							state.italic = false
						} 
						else if (ansiCode == 24) {
							state.underline = false
						}
					});
					ansiState = [];
				} 
				else {
					matchingData += str[i];
				}
				continue;
			}

			if (str[i] == '\u001B') {
				matchingControl = str[i]
			} 
			else if (str[i] == '\u0008') {
				eraseChar();
			} 
			else {
				matchingText += str[i]
			}
		}

		if (matchingText) {
			state.text = matchingText + (matchingControl ? matchingControl : '')
			result.push(state)
		}
		return result
	}
}