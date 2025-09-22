# OurCleanStreets Server

## Deployment process

- make change
- from root:
  - docker build -f apps/server/Dockerfile -t forkedupduck/ocs-server:latest .
  - docker push forkedupduck/ocs-server:latest
  - Deploy from Azure Container App -> Application -> containers -> update image tag

## Environment Variables

Set locally in .env
In Azure, go to deployed Container App -> Security -> Secrets -> Add the secret
-> Go to Application -> Containers -> Environment Variables -> Map the .env variable name to the secret
