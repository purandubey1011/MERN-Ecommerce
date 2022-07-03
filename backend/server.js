const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

// handling uncaughtException
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception. Shutting down...');
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

// config
dotenv.config({ path: 'backend/config/config.env' })

// database
connectDatabase()


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
    }
)
// console.log(youtube);

// unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`error: ${err.message}`)
    console.log('shutting down the server due to unhandled promise rejection')
    server.close(()=>{
        process.exit(1)
        })
     })