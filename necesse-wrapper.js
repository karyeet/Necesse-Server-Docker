const { setTimeout } = require("timers/promises");

const spawn = require("child_process").spawn;

// start server
const necesse_server = spawn("./jre/bin/java", ["-jar", "Server.jar", "-nogui"], { detached: true })

// set encoding
necesse_server.stdout.setEncoding('utf8');


necesse_server.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});

// set flag when server is up
let isServerUp = false
necesse_server.stdout.on("data", (message) => {
    if (message.match("Type help for list of commands.")) {
        isServerUp = true
        console.log("Detected Necesse server is up, will attempt to save on SIGTERM and SIGINT.")
    }
    if (message.match("Exiting in 2 seconds...")) {
        isServerUp = false
        console.log("Server gracefully shutdown.")
    }
})
// pipe stdin to necesse
process.stdin.pipe(necesse_server.stdin)
// pipe necesse stdout to process
necesse_server.stdout.pipe(process.stdout)
// pipe necesse stderr to process
necesse_server.stderr.pipe(process.stderr)

// child.stdin.write("console.log('Hello from PhantomJS')\n");
// catch terminations


function gracefulShutdown() {
    if(isServerUp){
        console.log("Attempting to save and exit necesse...")
        necesse_server.stdin.write("exit\n");
    }
}

process.once('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    gracefulShutdown()
});

process.once('SIGINT', () => {
    console.info('SIGINT signal received.');
    gracefulShutdown()
});

