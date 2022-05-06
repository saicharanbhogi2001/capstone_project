const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://saicharanbhogi:rssscharan.1352@cluster0.fcbfo.mongodb.net/capstoneproject?retryWrites=true&w=majority').then(()=>{
    console.log("Connected to mongodb")
});
const connection=mongoose.connection;
module.exports=connection;