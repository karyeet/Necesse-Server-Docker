# necesse-docker
 
 ## Features:
 - amd64, arm64/aarch64 support for the necesse server
 - Gracefully shutdown necesse server and save when container is stopped
 - Send commands to the server
 - Get logs from the server
 - Multiple ways to set the config

Multiarch image: [karyeet/necesse-server-docker:main](https://hub.docker.com/repository/docker/karyeet/necesse-server-docker/general)

## Install

1. `git clone https://github.com/karyeet/necesse-server-docker `

2. `cd ./necesse-server-docker`

3. `sudo docker compose up -d`

## Sending Commands and Getting Logs

### To send commands:
`sudo docker attach necesse_server`
To detatch, hit ctrl+p then ctrl+q

### To get logs:
Any of these commands will work:
1. `sudo docker compose logs` inside the `necesse-server-docker` folder
2. `sudo docker logs necesse_server`
3. To follow logs (view live): `docker logs --follow necesse_server`


## Configure

- You may set the environment variables in the docker-compose.yml file.
- You may also remove an environment variable from the docker-compose.yml file and edit it directly in the server.cfg
- By default, the server uses port 14159/udp.
  - To change the port to, for example, port 1738 you must change the `14159:14159/udp` in the docker-compose.yml to `1738:14159/udp`.
- Explanations to all the configuration options can be found in the server.cfg file.

## Saving
The server will save worlds to the `saves` folder.
Logs are in the `logs` folder.

## Importing worlds
You can import a world by copying the .zip into ./saves folder and changing `world=myNewWorld` in the docker-compose.yml to the name of the .zip, whichout the .zip part.

Ex: If the file is called coolestNecesseWorld.zip, then change `world=myNewWorld` to `world=coolestNecesseWorld`.

I recommend periodically making a backup of your world outside of that directory.


