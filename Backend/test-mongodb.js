const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect('mongodb+srv://harshnee:Harsh%4021@cluster0.va8gnjy.mongodb.net/yogshala?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ MongoDB connected successfully!');
    
    // Test a simple query
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
