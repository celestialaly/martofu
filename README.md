# Martofu

Martofu helps you manage your Dofus sales with a clean UX/UI interface

## Stack

- Symfony 6.4 with [API Platform 3.4](https://api-platform.com/)
- Vue 3
    - [PrimeVue](https://primevue.org/) - UI library
    - [PrimeFlex](https://primeflex.org/) - CSS Utility Library
    - [Vuelidate](https://vuelidate-next.netlify.app/) - Form validation
    - [Pinia](https://pinia.vuejs.org/) - Store
- Docker based on [dunglas/symfony-docker](https://github.com/dunglas/symfony-docker) and updated to handle the frontend

## Development

### Installation
1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/) (v2.10+)
2. Run `docker compose build --no-cache` to build fresh images
3. Run `SERVER_NAME=martofu.localhost docker compose up -d --wait` to set up the project
4. Run `docker compose down --remove-orphans` to stop the Docker containers.

### Configuration
1. Generate JWT keys with `docker compose exec php php bin/console lexik:jwt:generate-keypair`
2. Set the API URL (see below) in `assets/vue/.env` env file

### Navigate
1. Open `https://martofu.localhost/api` to browse the API docs
2. Open `http://localhost:5173` to access the Vue 3 frontend


The frontend is located under the `/assets/vue` folder. 

## Testing

Testing the API is done with PHPUnit:
```sh
docker compose exec php bin/phpunit
```
