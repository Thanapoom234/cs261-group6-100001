CS261 Group Project
This project is designed to set up a development environment with Docker, utilizing a .env file for configuration.

Setup Instructions
Follow these steps to get started with the project:

1. Clone the Repository
Clone this repository to your local machine:

bash
Copy code
git clone https://github.com/ThanapoomPol/cs261-group6-100001.git
2. Open Command Prompt in Project Directory
Navigate to the project folder:

bash
Copy code
cd cs261-group6-100001
3. Create .env File for Frontend Configuration
Inside the frontend folder, create a .env file and add the following environment variables:

makefile
Copy code
TU_API_KEY=<your_TU_API_Key>
SESSION_SECRET=4a526ee5c26470a5fec98d5d82f3e38c5bf20f0ebf0ba21e377156acf4338c55aad4e68d440f6cf49926dce739ed419e58acecb0aac1f1a369e1fe1976e527a4
PORT=3000
Make sure the .env file is located inside the frontend directory.

4. Run the Project with Docker
Run the following command to build and start the containers:

css
Copy code
docker-compose up --build
This will build and start all necessary services defined in the docker-compose.yml file.

Your application should now be up and running on the specified port. Open your browser and navigate to http://localhost:3000 to access the application.
