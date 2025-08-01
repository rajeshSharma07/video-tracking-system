require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Video = require('./models/Video'); // Adjust path if needed

const videosData = [
  {
    _id: uuidv4(),
    title: "Introduction to Web Development",
    description: "Learn the basics of modern web development from scratch.",
    url: "https://www.youtube.com/watch?v=4WjtQjPQGIs&ab_channel=ApnaCollege", // Replace with actual video URL
    duration: 3600,
    thumbnail: "https://i.pinimg.com/736x/00/83/fa/0083fac77fd08806ddb7bdb6a2ee0b82.jpg", // Replace with actual thumbnail URL
    isPublished: true
  },
  {
    _id: uuidv4(),
    title: "React.js State Management Deep Dive",
    description: "Understand advanced state management patterns in React using Hooks and Context API.",
    url: "https://www.youtube.com/watch?v=LuNPCSNr-nE&ab_channel=CodeStepByStep",
    duration: 5400,
    thumbnail: "https://i.pinimg.com/1200x/2f/e0/7d/2fe07d6382f161944c11a3c26f81ff10.jpg",
    isPublished: true
  },
  {
    _id: uuidv4(),
    title: "Node.js API with Express & MongoDB",
    description: "Build a RESTful API using Node.js, Express, and Mongoose for MongoDB.",
    url: "https://www.youtube.com/watch?v=ugsRzHMIF2o&t=1s&ab_channel=SmileandLearn-English",
    duration: 7200,
    thumbnail: "https://i.pinimg.com/1200x/b0/bf/7b/b0bf7b591bb0295c182c7992c65617f0.jpg",
    isPublished: true
  },
   {
    _id: uuidv4(),
    title: "What is SQL? Future Career Scope & Resources",
    description: "What is SQL? Future Career Scope & Resources.",
    url: "https://youtu.be/UOJZTqA5Loc",
    duration: 371,
    thumbnail: "https://imgs.search.brave.com/jqYKu14CCKf_KiFVQ3tVrVlHkx9zIS5suheSRdyyRMI/rs:fit:500:0:1:0/g:ce/aHR0cDovL3d3dy53/M3NjaG9vbHMuY29t/L2ltYWdlcy9pbWdf/ZmFfdXBfMzAwLnBu/Zw",
    isPublished: true
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    await Video.deleteMany({}); // Optional: clear existing videos
    await Video.insertMany(videosData);
    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    await Video.deleteMany({});
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error('Error destroying data:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}