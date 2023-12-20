const {spawn} = require("child_process");

const fs = require('fs');

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

// start server
const necesse_server = spawn("/necesse-server/jre/bin/java", ["-jar", "/necesse-server/Server.jar", "-nogui", "-world", process.env.world], { detached: true })

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

