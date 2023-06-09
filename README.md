## Setup

1. Install the following:
   - [.NET Core 3.1](https://www.microsoft.com/net/core)
   - [Node.js >= v8](https://nodejs.org/en/download/)
   - [Ansible >= 2.6](http://docs.ansible.com/ansible/intro_installation.html)
   - [Docker](https://docs.docker.com/engine/installation/)
2. Run `npm install && npm start`
3. Open browser and navigate to [http://localhost:5000](http://localhost:5000).

This template was developed and tested on macOS Sierra but should run on Windows (for development) as well.  If you experience any issues getting it to run on Windows and work through them, please submit a PR!  The production provisioning and deployment scripts (`provision:prod` and `deploy:prod`) use Ansible and require a Linux/Ubuntu >= 16.04 target host.

## Scripts

### `npm install`

When first cloning the repo or adding new dependencies, run this command.  This will:

- Install Node dependencies from package.json
- Install .NET Core dependencies from api/api.csproj and api.test/api.test.csproj (using dotnet restore)

### `npm start`

To start the app for development, run this command.  This will:

- Run `docker-compose up` to ensure the PostgreSQL and MailCatcher Docker images are up and running
- Run `dotnet watch run` which will build the app (if changed), watch for changes and start the web server on http://localhost:5000
- Run Webpack dev middleware with HMR via [ASP.NET JavaScriptServices](https://github.com/aspnet/JavaScriptServices)

### `npm run migrate`

After making changes to Entity Framework models in `api/Models/`, run this command to generate and run a migration on the database.  A timestamp will be used for the migration name.

### `npm test`

This will run the xUnit tests in api.test/ and the Mocha/Enzyme tests in client-react.test/.

### `npm run provision:prod`

 _Before running this script, you need to create an ops/config.yml file first.  See the [ops README](ops/) for instructions._

 This will run the ops/provision.yml Ansible playbook and provision hosts in ops/hosts inventory file.  Ubuntu 16.04 (Xenial) and Ubuntu 18.04 (Bionic) is supported and tested.

 This prepares the hosts to recieve deployments by doing the following:
  - Install Nginx
  - Generate a SSL certificate from [Let's Encrypt](https://letsencrypt.org/) and configure Nginx to use it
  - Install .Net Core
  - Install Supervisor (will run/manage the ASP.NET app)
  - Install PostgreSQL
  - Setup a cron job to automatically backup the PostgreSQL database, compress it, and upload it to S3.
  - Setup UFW (firewall) to lock everything down except inbound SSH and web traffic
  - Create a deploy user, directory for deployments and configure Nginx to serve from this directory

### `npm run deploy:prod`

_Before running this script, you need to create a ops/config.yml file first.  See the [ops README](ops/) for instructions._

This script will:
 - Build release Webpack bundles
 - Package the .NET Core application in Release mode (dotnet publish)
 - Run the ops/deploy.yml Ansible playbook to deploy this app to hosts in /ops/config.yml inventory file.

 This does the following:
  - Copies the build assets to the remote host(s)
  - Updates the `appsettings.json` file with PostgreSQL credentials specified in ops/group_vars/all file and the app URL (needed for JWT tokens)
  - Restarts the app so that changes will be picked up

 Entity Framework Migrations are [automatically applied upon startup](https://github.com/bradymholt/aspnet-core-react-template/blob/master/api/Program.cs#L23-L24) so they will run when the app restarts.

## Development Email Delivery

This template includes a [MailCatcher](https://mailcatcher.me/) Docker image so that when email is sent during development (i.e. new user registration), it can be viewed
in the MailCacher web interface at [http://localhost:1080/](http://localhost:1080/).

## Older Versions

This template was originally created on .NET Core 1.0 and has been upgraded with new versions of .NET Core.  Older versions can be found on the [Releases](https://github.com/bradymholt/aspnet-core-react-template/releases) page.

## Visual Studio Code config

This project has [Visual Studio Code](https://code.visualstudio.com/) tasks and debugger launch config located in .vscode/.

### Tasks

- **Command+Shift+B** - Runs the "build" task which builds the api/ project
- **Command+Shift+T** - Runs the "test" task which runs the xUnit tests in api.test/ and Mocha/Enzyme tests in client-react.test/.

### Debug Launcher

With the following debugger launch configs, you can set breakpoints in api/ or the the Mocha tests in client-react.test/ and have full debugging support.

- **Debug api/ (server)** - Runs the vscode debugger (breakpoints) on the api/ .NET Core app
- **Debug client-react.test/ (Mocha tests)** - Runs the vscode debugger on the client-react.test/ Mocha tests
