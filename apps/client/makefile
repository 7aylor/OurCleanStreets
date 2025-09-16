# Makefile for OCS Docker app

APP_NAME = ocs-client

# Build the Docker image
build:
	docker build -t $(APP_NAME) ./

# Run the container (map host 3000 -> container 80)
run:
	docker run --rm -p 3000:80 $(APP_NAME)

# Stop all running containers of this app
stop:
	@docker ps -q --filter ancestor=$(APP_NAME) | xargs -r docker stop

# Remove the image
clean:
	docker rmi -f $(APP_NAME)
