//we are imprting express package and storing it in varibale
const express = require('express');
// You're invoking the express() function, which returns an object (the Express application instance), and you're storing it in the app variable.
const app = express();
// A port is like a door through which your application communicates on your computer or server.
const port = 3000;

app.get('/',(req,res)=>{
    res.send('Hello your server is working');
})




const databse = require('./utilities/sql');
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