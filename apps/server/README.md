# OurCleanStreets Server

## Deployment process

make change
docker build -t forkedupduck/ocs-server:latest .
docker push forkedupduck/ocs-server:latest
Deploy from Azure Container App -> Application -> containers -> update image tag
