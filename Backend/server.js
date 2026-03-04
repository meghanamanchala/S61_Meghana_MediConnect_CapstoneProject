require('dotenv').config();

const connectDB = require('./config/db.js'); 
const app = require('./app.js');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});