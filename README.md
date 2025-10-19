# necesse-server-docker
 
 ## Features:
 - amd64, arm64/aarch64 support for the necesse server
 - Gracefully shutdown necesse server and save when container is stopped
 - Send commands to the server
 - Get logs from the server
 - Multiple ways to set the config
 - [NEW] Daily image builds to latest necesse server version
      >To update, just pull the latest image (sudo docker compose pull) and recreate your container.
 - Complete [docker-compose.yml](https://github.com/karyeet/Necesse-Server-Docker/blob/main/docker-compose.yml) file provided

Multiarch image: [karyeet/necesse-server-docker:latest](https://hub.docker.com/r/karyeet/necesse-server-docker)

## Install

1. `git clone https://github.com/karyeet/necesse-server-docker `

## Start
1. `cd ./necesse-server-docker`
2. `sudo docker compose up -d`

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

## JVM Options /  Arguments

JVM options can be set by modifying the JVM_OPTS environment variable set in docker-compose.yml. Remember to uncomment it.
I've set it to `-Xms1G -Xmx2G` as an example, but I don't know if those settings are best, so please don't feel that you should use them.

## Saving
The server will save worlds to the `saves` folder.
Logs are in the `logs` folder.

## Mods
1. Run the server once to create file structure: 
    1. `sudo docker compose up -d`
    2. count to 3
    3. `sudo docker compose down`
2. Copy mod .jar into the mod folder created in the `necesse-server-docker` folder.
3. Start server: `sudo docker compose up -d`


## Importing worlds
You can import a world by copying the .zip into ./saves folder and changing `world=myNewWorld` in the docker-compose.yml to the name of the .zip, whichout the .zip part.

Ex: If the file is called coolestNecesseWorld.zip, then change `world=myNewWorld` to `world=coolestNecesseWorld`.

I recommend periodically making a backup of your world outside of that directory.


