const express = require('express'), mongoose = require('mongoose'), cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const User = require('./models/User'), Pose = require('./models/Pose'), Sequence = require('./models/Sequence'), UserProgress = require('./models/UserProgress');

// Improved MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yogshala', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds timeout
}).then(async () => {
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;
  console.log('Database name:', db.databaseName);
  
  // Wait a bit for connection to stabilize
  setTimeout(async () => {
    try {
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      console.log('Current document counts:');
      console.log('- Users:', await User.countDocuments());
      console.log('- UserProgress:', await UserProgress.countDocuments());
      console.log('- Sequences:', await Sequence.countDocuments());
      
      // Initialize data after connection is stable
      await initializePoses();
      await initializeSequences();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, 2000);
}).catch(e => {
  console.error('MongoDB connection error:', e);
  // Don't crash the server if MongoDB fails
});
const initializePoses=async()=>{if(await Pose.countDocuments()===0){await Pose.insertMany([
{name:'Mountain Pose',difficulty:'Beginner',benefits:'Improves posture, strengthens thighs and ankles',duration:60,instruction:'Stand tall with feet together'},
{name:'Downward Dog',difficulty:'Beginner',benefits:'Strengthens arms and legs',duration:90,instruction:'Form an inverted V-shape with your body'},
{name:'Warrior II',difficulty:'Intermediate',benefits:'Strengthens legs and arms',duration:120,instruction:'Stand with legs wide apart, arms parallel to floor'},
{name:'Tree Pose',difficulty:'Intermediate',benefits:'Improves balance',duration:90,instruction:'Stand on one leg with other foot on inner thigh'},
{name:'Headstand',difficulty:'Advanced',benefits:'Strengthens arms and shoulders',duration:180,instruction:'Balance upside down on your head and forearms'},
{name:'Crow Pose',difficulty:'Advanced',benefits:'Strengthens arms and wrists',duration:120,instruction:'Balance your knees on your upper arms'},
{name:"Child's Pose",difficulty:'Beginner',benefits:'Relieves back pain',duration:60,instruction:'Sit back on heels with arms stretched forward'},
{name:'Bridge Pose',difficulty:'Intermediate',benefits:'Strengthens back muscles',duration:90,instruction:'Lift hips while lying on your back'},
{name:'Cobra Pose',difficulty:'Beginner',benefits:'Strengthens the spine',duration:60,instruction:'Lift chest while lying on stomach'}]);console.log('Default poses initialized');}};
const initializeSequences=async()=>{if(await Sequence.countDocuments()===0){await Sequence.insertMany([
{username:'system',name:'Morning Routine',poses:[{name:'Mountain Pose',duration:60},{name:'Downward Dog',duration:90},{name:'Warrior II',duration:120}],totalDuration:270,isDefault:true},
{username:'system',name:'Back Pain Relief',poses:[{name:"Child's Pose",duration:90},{name:'Warrior II',duration:120},{name:'Cobra Pose',duration:90}],totalDuration:300,isDefault:true}
]);console.log('Default sequences initialized');}};
app.use('/api/sequences',require('./routes/sequenceRoutes'));
app.use('/api/progress',require('./routes/progressRoutes'));
app.use('/api/poses',require('./routes/poseRoutes'));
app.use('/api/users',require('./routes/userRoutes'));
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`Server running on port ${port}`));