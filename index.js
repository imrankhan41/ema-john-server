const express =require("express");
const { MongoClient } = require('mongodb');
const app = express();
const cors =require("cors");
const port =process.env.PORT || 5000;
require('dotenv').config()
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irhuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("emaJohn");
        const productCollection = database.collection("products");

        //Get products api

        app.get("/products",async(req,res)=>{
            console.log(req.query)
            const cursor =productCollection.find({});
            const page= req.query.page;
            const size =parseInt(req.query.size);
            const count =await cursor.count();
            let products;
            if(page){
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else{
                products =await cursor.toArray();
            }
            
           
            res.send({
                count,
                products});
        })
        app.post("/products/bykeys",async (req,res)=>{
            const keys=req.body;
            const query ={key:{$in:keys}}
            const products =await productCollection.find(query).toArray();
            res.json(products)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get("/",(req,res)=>{
    res.send("ema john server")
});
app.listen(port,()=>{
    console.log("server is running",port)
})