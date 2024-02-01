const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Only needed if handling JSON in your routes

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flzolds.mongodb.net/your-database-name?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Get the database and collection on which to run the operation
    const hotelDataCollection = client.db("airbnbDB").collection("hotelData");
    const hotelListDataCollection = client.db("airbnbDB").collection("hotelListData")

    // Define route after connection is established
    app.get('/hotelData', async (req, res) => {
      try {
        const result = await hotelDataCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    
    app.get('/hotelListData', async(req, res)=>{
      try{
        const result = await hotelListDataCollection.find().toArray();
        res.send(result)
      }
      catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).send('Internal Server Error');
      }
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Start the server after setting up routes and connecting to MongoDB
    
    app.listen(port, () => {
      console.log(`AirBnb server is running on Port ${port}`);
    });
  } finally {
    // Ensure that the client will close when you finish/error
    // Don't close the client here; it should remain open as long as the server is running
  }
}

run().catch(console.dir);

app.get('/',(req, res)=>{
  res.send('Airbnb Server is running')
})

