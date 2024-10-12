import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            await client.connect();
            const database = client.db('mrnzdDB');
            const usersCollection = database.collection('users');
            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const newUser = { email, username, password };
            await usersCollection.insertOne(newUser);
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await client.close();
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
