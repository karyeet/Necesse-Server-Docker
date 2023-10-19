#!/bin/bash


CONFIG_FILE=/root/.config/Necesse/cfg/server.cfg
COPY_CONFIG=/root/serverCopy.cfg

cp $CONFIG_FILE $COPY_CONFIG

# $1 targetkey
# $2 replacementvalue
replaceKey(){
    if ! [ -v ${1} ]
    then
        echo "$1 is unset"
    else
        echo "Setting $1 to ${!1}"
        sed -ic "s/\($1 *= *\).*\/\//\1${!1}, \/\//" $COPY_CONFIG
    fi
}

echo "Setting environment variables:"

replaceKey "port" $port
replaceKey "slots" $slots
replaceKey "password" $password
replaceKey "maxClientLatencySeconds" $maxClientLatencySeconds
replaceKey "pauseWhenEmpty" $pauseWhenEmpty
replaceKey "giveClientsPower" $giveClientsPower
replaceKey "logging" $logging
replaceKey "language" $language
replaceKey "jobSearchRange" $jobSearchRange
replaceKey "zipSaves" $zipSaves
replaceKey "MOTD" $MOTD

cp $COPY_CONFIG $CONFIG_FILE 

cd "$(dirname "$0")"
exec /necesse-server/jre/bin/java -jar Server.jar -nogui $world