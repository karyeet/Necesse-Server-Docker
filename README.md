# necesse-docker
 amd64, x64, arm64, aarch64 support for the necesse server in a container

Multiarch image: [karyeet/necesse-server-docker:main](https://hub.docker.com/repository/docker/karyeet/necesse-server-docker/general)

Environment variables can be set in the docker-compose.yml file.
ENV variables in the compose file take precedent.
If you remove the variable from the compose file, you may edit it from the server.cfg.

## WARNING:
### This image is experimental.
The image will now save and gracefully exit on docker stop and should be safe for use. However, it has not been thourougly tested.


## Saving
The server will save to ./saves

## Importing worlds
You can import a world by putting the .zip in ./saves.

I recommend making a backup of your world outside of that directory.

## Install

1. `git clone https://github.com/karyeet/necesse-server-docker `

2. `cd ./necesse-server-docker`

3. `sudo docker compose up -d`

To send commands to the server:

`sudo docker attach necesse-server`


