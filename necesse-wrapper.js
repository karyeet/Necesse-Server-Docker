const {spawn} = require("child_process");
const fs = require('fs');
const os = require('os');

function editConfigFile(filePath, settingName, newValue) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    // Define the regular expression pattern to match the setting and its value
    const pattern = new RegExp(`(${settingName}\\s*=\\s*)([^,\\/\\s]*)`, 'g');
    // Replace the old value with the new value
    const newData = data.replace(pattern, `$1${newValue}`);
    // Write the modified content back to the file
    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log(`Setting '${settingName}' updated to '${newValue}' in ${filePath}`);
    });
  });
}

const configFilePath = "/root/.config/Necesse/cfg/server.cfg"
editConfigFile(configFilePath, "port", process.env.port)
editConfigFile(configFilePath, "slots", process.env.slots)
editConfigFile(configFilePath, "password", process.env.password)
editConfigFile(configFilePath, "maxClientLatencySeconds", process.env.maxClientLatencySeconds)
editConfigFile(configFilePath, "pauseWhenEmpty", process.env.pauseWhenEmpty)
editConfigFile(configFilePath, "giveClientsPower", process.env.giveClientsPower)
editConfigFile(configFilePath, "logging", process.env.logging)
editConfigFile(configFilePath, "language", process.env.language)
editConfigFile(configFilePath, "unloadLevelsCooldown", process.env.unloadLevelsCooldown)
editConfigFile(configFilePath, "worldBorderSize", process.env.worldBorderSize)
editConfigFile(configFilePath, "droppedItemsLifeMinutes", process.env.droppedItemsLifeMinutes)
editConfigFile(configFilePath, "unloadSettlements", process.env.unloadSettlements)
editConfigFile(configFilePath, "maxSettlementsPerPlayer", process.env.maxSettlementsPerPlayer)
editConfigFile(configFilePath, "maxSettlersPerSettlement", process.env.maxSettlersPerSettlement)
editConfigFile(configFilePath, "jobSearchRange", process.env.jobSearchRange)
editConfigFile(configFilePath, "zipSaves", process.env.zipSaves)
editConfigFile(configFilePath, "MOTD", process.env.MOTD)

// Detect architecture
const arch = os.arch();
console.log(`Detected architecture: ${arch}`);

// Determine JRE path based on architecture
let jrePath;
if (arch === 'arm64' || arch === 'aarch64') {
  jrePath = "/necesse-server/jre-arm64/bin/java";
} else {
  jrePath = "/necesse-server/jre/bin/java";
}

console.log(`Using JRE at: ${jrePath}`);

// Build JVM arguments with memory options
const jvmArgs = [];

// Add memory settings if provided
const minMemory = process.env.JVM_MIN_MEMORY || "512M";
const maxMemory = process.env.JVM_MAX_MEMORY || "2G";
jvmArgs.push(`-Xms${minMemory}`);
jvmArgs.push(`-Xmx${maxMemory}`);

// Add any additional JVM options
if (process.env.JVM_OPTS) {
  const additionalOpts = process.env.JVM_OPTS.split(' ').filter(opt => opt.trim() !== '');
  jvmArgs.push(...additionalOpts);
}

// Add the JAR file and server arguments
jvmArgs.push("-jar", "/necesse-server/Server.jar", "-nogui", "-world", process.env.world);

// Add owner if specified
if (process.env.owner) {
  jvmArgs.push("-owner", process.env.owner);
}

console.log(`Starting server with JVM args: ${jvmArgs.join(' ')}`);

// start server
const necesse_server = spawn(jrePath, jvmArgs, { detached: true })

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

function gracefulShutdown() {
    if (isServerUp) {
        console.log("Attempting to save and exit necesse...")
        necesse_server.stdin.write("exit\n");
    }
}

// catch terminations
process.once('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    gracefulShutdown()
});
process.once('SIGINT', () => {
    console.info('SIGINT signal received.');
    gracefulShutdown()
});
