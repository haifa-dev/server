# Haifa:dev - Server

## Prerequisites:

- You need a `PostgreSQL` database installed and configured.
  You can get `PostgreSQL` from [here][postgresql].

- You need `git` to clone the project repository. You can get `git` from [here][git].

- You must have `Node.js` and its package manager (`npm`) installed. You can get them from [here][node].

- You can run `PostgreSQL` with [Docker][docker]:

```sh
sudo docker run --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
```

## Getting started

- Open the terminal at the project directory and run the command:

```sh
npm install
cp .env.example .env
npm start
```

- On Windows:

```bat
npm install
copy .env.example .env
npm start
```

- You should see the server running with the output:

```sh
Listening on port 5000
Connection to database established successfully
```

Now browse to the app at [`localhost:5000`][local-app-url].

[git]: https://git-scm.com/
[local-app-url]: http://localhost:5000
[node]: https://nodejs.org/
[npm]: https://www.npmjs.org/
[postgresql]: https://www.postgresql.org/download/
[docker]: https://docs.docker.com/get-docker/
