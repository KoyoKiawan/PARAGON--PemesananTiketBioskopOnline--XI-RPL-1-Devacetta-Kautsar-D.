const http = require('http');
const app = require('./app');
const port = process.env.port || 5000;

const server = http.createServer(app);

server.listen(port, () =>{
    console.log(`Server is running at : http://localhost:${port}/api`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});