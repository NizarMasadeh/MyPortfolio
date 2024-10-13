import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
     
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db('mrnzdDB');
      const collection = db.collection('users');

      
      const { email, username, password } = req.body;

      
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      
      const newUser = { email, username, password };
      const result = await collection.insertOne(newUser);

      // Close the database connection
      await client.close();

      // Respond with success message
      return res.status(201).json({ message: 'User created successfully!', userId: result.insertedId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create user.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
