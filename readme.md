# The Library 
 **Nginx** File Hoster with File Search Engine through **Sqlite FTS5** extension running on a reverse proxied **ExpressJS** server.
 
## Under Development
This project is strictly under development, with most of its core functionality still missing.
 
## Features
- TypeScript backend server
- Nginx File Hoster
- Sqlite database for search functionality
- Directory Crawler
- FFmpeg Grid Thumnail maker

## Prerequisites
Before running this project, make sure you have the following installed:
- Node.JS (`18.0^`)
- npm (`8.0^`)
- **Docker** and **Docker Compose**

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Atomklin/the-library
```

2. run the start script
```bash
# For development :
start-dev.cmd
# For production
start-prod.cmd # or docker compose up -d
```

3. Access the application:
 Open your browser and navigate to `http://localhost:5173/` (or `port 80` in production) to access the application.

## Usage
- The TypeScript backend server handles API requests and database operations.
- The Nginx static file server serves static files (HTML, video, audio etc.) from the `./Data/files` directory.
- The SQLite search engine provides search functionality for the application.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please create an issue or submit a pull request.

## To do :
- [ ] Video and Audio Player
- [ ] Album viewer
- [ ] File Description and tags editor
- [ ] File Uploader
- [ ] User authentication

# License 
This project is licensed under the [MIT License](LICENSE).