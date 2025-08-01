//we are imprting express package and storing it in varibale
const express = require('express');
// You're invoking the express() function, which returns an object (the Express application instance), and you're storing it in the app variable.
const app = express();
// A port is like a door through which your application communicates on your computer or server.
const port = 3000;
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const fs = require('fs');
//to write all the log statements into a file rather than in console
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('combined',{stream:accessLogStream}));
//routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const reportRoutes = require('./routes/reportRoutes');

//route handler
app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/pay',paymentRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgotPasswordRoutes);
app.use('/report',reportRoutes);
//first method that we get
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
});
//root path
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','signup.html'));
});
app.get('/password/resetpassword/:token', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'resetPassword.html'));
});

//database synchronization
const databse = require('./utilities/sql');
require('./models/association');
(async ()=>{
    try {
        await databse.sync({force:false});
        app.listen(port,()=>{
            //this console.log will be visible in terminal
            console.log(`Server is running at http://localhost:${port}`);
        })
    } catch (error) {
        console.error('Unable to connect to database')    
    }
})();
// database.sync({force:false})
//             .then(()=>{
//                 app.listen(port,()=>{
//                     console.log(`Server is running at http://localhost:${port}`);        
//                 })
//             }).catch((error)=>{
//                 console.error('Unable to connect to database',error)
//             });
// async function connection (){
//     try {
//         await databse.sync({force:false});
//         app.listen(port,()=>{
//             console.log(`Server is running at http://localhost:${port}`);
//         })
//     } catch (error) {
//         console.error('Unable to connect to database')    
//     }
// }
// connection();