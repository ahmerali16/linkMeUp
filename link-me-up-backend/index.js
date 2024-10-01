const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("uploads"));
dotenv.config();


mongoose.connect('mongodb://127.0.0.1:27017/linkMeUpDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(9002, () => {
        console.log("Server is connected and Connected to MongoDB");
    })
}).catch(error => {
    console.log("Unable to connect Server and/or MongoDB", error);
});

// Provider Routes
const ProviderRouter = require("./routes/ProviderRoutes")
app.use("/Provider", ProviderRouter)


//Admin Routes
const AdminRouter = require("./routes/AdminRoutes")
app.use("/Admin", AdminRouter)

//Package Routes
const PackageRouter = require("./routes/PackagesRoutes");
app.use("/Package", PackageRouter)

//Consumer Routes
const ConsumerRouter = require("./routes/ConsumerRoutes")
app.use("/Consumer", ConsumerRouter)

//Cart Routes
const CartRouter = require("./routes/CartRoutes")
app.use("/Cart", CartRouter)