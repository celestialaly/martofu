# Martofu

Martofu makes your Dofus sales easier to follow

## Stack

- Symfony 6.4 with [API Platform 3.4](https://api-platform.com/)
- Vue 3
    - [PrimeVue](https://primevue.org/) - UI library
    - [PrimeFlex](https://primeflex.org/) - CSS Utility Library
    - [Vuelidate](https://vuelidate-next.netlify.app/) - Form validation
    - [Pinia](https://pinia.vuejs.org/) - Store
- Docker based on [dunglas/symfony-docker](https://github.com/dunglas/symfony-docker) and updated to handle the frontend

## Development

1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/) (v2.10+)
2. Run `docker compose build --no-cache` to build fresh images
3. Run `SERVER_NAME=martofu.localhost docker compose up -d --wait` to set up the project
4. Open `https://martofu.localhost/api` to browse the API docs
5. Open `http://localhost:5173` to access the Vue 3 frontend
6. Run `docker compose down --remove-orphans` to stop the Docker containers.

The frontend is located under the `/assets/vue` folder. 
