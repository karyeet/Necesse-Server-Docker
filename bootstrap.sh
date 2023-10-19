#!/bin/bash


CONFIG_FILE=/root/.config/Necesse/cfg/server.cfg

# $1 targetkey
# $2 replacementvalue
replaceKey(){
    if ! [ -v ${1} ]
    then
        echo "$1 is unset"
    else
        echo "Setting $1 to ${!1}"
        sed -ic "s/\($1 *= *\).*\/\//\1${!1}, \/\//" $CONFIG_FILE
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

/necesse-server/StartServer-nogui.sh -world $world