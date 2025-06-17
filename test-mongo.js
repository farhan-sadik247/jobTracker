const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'your-mongodb-uri-here';
  
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test database access
    const db = client.db('jobtracker');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test inserting a document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Test connection'
    };
    
    const result = await db.collection('test').insertOne(testDoc);
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Clean up test document
    await db.collection('test').deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await client.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔑 Check your username and password in the MongoDB URI');
    }
    if (error.message.includes('network')) {
      console.log('🌐 Check your network connection and IP whitelist in MongoDB Atlas');
    }
  }
}

testConnection();