var btsyncjs_commands = "init|add-folder|remove-folder|device-name|folders|config|restart".split('|');
var shell_commands = "ls|mkdir|rm".split('|');
var console_commands = "help|cd".split('|');

var execfile = require('child_process').execFile;
var parse = require('shell-quote').parse;

function completer(line) {
    var completions = [].concat(btsyncjs_commands).concat(shell_commands).concat(console_commands);
    var hits = completions.filter((c) => {
            return c.indexOf(line) == 0
        })
        // show all completions if none found
    return [hits.length ? hits : completions, line]
}

function inarray(arr, s) {
    return (arr.indexOf(s) >= 0)
}

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout, completer),
    prefix = 'BTSYNC> ';

rl.on('line', function(line) {
    trimmed = parse(line.trim());
    cmd = trimmed[0]

    if (inarray(btsyncjs_commands, cmd)) {
        cmd_binary = "nodejs"
        cmd_args = ["btsync.js"].concat(trimmed)

    } else if (inarray(shell_commands, cmd)) {
        cmd_binary = trimmed[0];
        cmd_args = trimmed.slice(1);
    } else {
        switch (cmd) {
            case "help":
                console.log("Available commands:", btsyncjs_commands, shell_commands, console_commands);
                break;
            case "cd":
                console.log("Changing directory to", trimmed[1]);
                process.chdir(trimmed[1]);
                break;
            default:
                console.log("Unknown command:", trimmed);
                break;
        }
        rl.prompt();
        return;
    }

    execfile(cmd_binary, cmd_args, (err, stdout, stderr) => {
        if (err) {
            console.log("Exitcode", err)
        };
        console.log(stdout, stderr);
        rl.prompt();
    })
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});

console.log(prefix + 'Good to see you. Try typing stuff.');
rl.setPrompt(prefix, prefix.length);
rl.prompt();
