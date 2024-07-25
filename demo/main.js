let wt = new WebTerm(document.body)
// wt.enableAnsiColor(false)

wt.writeln("\x1b[0;92m__        __   _   _____                          \x1b[0m")
wt.writeln("\x1b[0;92m\\ \\      / /__| |_|_   _|__ _ __ _ __ ___       \x1b[0m")
wt.writeln("\x1b[0;92m \\ \\ /\\ / / _ \\ '_ \\| |/ _ \\ '__| '_ ` _ \\ \x1b[0m")
wt.writeln("\x1b[0;92m  \\ V  V /  __/ |_) | |  __/ |  | | | | | |      \x1b[0m")
wt.writeln("\x1b[0;92m   \\_/\\_/ \\___|_.__/|_|\\___|_|  |_| |_| |_|   \x1b[0m\n")

wt.write("\x1b[0;32m$\x1b[0m ")
wt.onwrite = function(line){
	console.log(line)
	wt.writeln(line)
	wt.write("\x1b[0;32m$\x1b[0m ")
}

console.log(wt)
