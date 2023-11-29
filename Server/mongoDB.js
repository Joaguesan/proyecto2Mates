const user = "a22osczapmar";
const password = "Nitrome7.";
module.exports = { getDocument, getPreguntas, getPregunta };
const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://${user}:${password}@cluster0.uiii7nf.mongodb.net/`;

// Database Name
const dbName = 'mathGameMongo';

// Create a new MongoClient
const client = new MongoClient(url);
// Connect to the Atlas cluster
client.connect();

async function getDocument() {
    try {
        
         const db = client.db(dbName);
         const col = db.collection("activity");
         // Find and return the document
         const filter = { "id": 1 };
         const document = await col.findOne(filter);
         return document;
        } catch (err) {
         console.log(err.stack);
     }
}

async function getPreguntas(preguntas) {
    try {
        // Connect to the Atlas cluster
         await client.connect();
         const db = client.db(dbName);
         const col = db.collection("question");
         // Find and return the document
         const filter = { "id": { $in: preguntas } };
         const document = await col.find(filter).toArray();
         return document;
        } catch (err) {
         console.log(err.stack);
     }
}

async function getPregunta(id) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("question");
        //Find question from collection
        const question = await col.find({"id":id}).toArray();
        console.log(question)
        return question;
    } catch (err) {
        console.log(err.stack)
    }
}