# OurCleanStreets Server

## Deployment process

- make change
- from root (needed to pull in types package):
  - docker build -f apps/server/Dockerfile -t forkedupduck/ocs-server:{version} .
  - docker push forkedupduck/ocs-server:{version}
  - Deploy from Azure Container App -> Application -> containers -> update image tag

## Environment Variables

Set locally in .env
In Azure, go to deployed Container App -> Security -> Secrets -> Add the secret
-> Go to Application -> Containers -> Environment Variables -> Map the .env variable name to the secret
