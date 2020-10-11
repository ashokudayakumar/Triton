const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/error');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const connectDB = require('./config/db');
connectDB();
const auth = require('./router/auth');
const vote = require('./router/vote');
const count = require('./router/count');
const app = express();
app.use(express.json())
app.use(cors());

app.use('/api/v1/auth',auth);
app.use('/api/v1/vote',vote);
app.use('/api/v1/count',count);
app.use(errorHandler);
const server= app.listen(process.env.PORT, console.log(`server connected ${process.env.PORT}`));
process.on('unhandledRejection',(err)=>{
    console.log(`error: ${err.message}`);
    server.close(()=>process.exit(1));
})