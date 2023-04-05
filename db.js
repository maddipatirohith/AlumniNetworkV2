const mongoose = require("mongoose");

function connectToMongo() {
    mongoose.set("strictQuery", true);
    mongoose.connect('mongodb://127.0.0.1:27017/CG',
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false}
);
    /* mongoose.connect('mongodb+srv://SyedFahad:qVSWAthZ3bgrzha@cluster0.q71wutp.mongodb.net/AlumniNetwork?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    );
     */

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Connected successfully");
    });
}

module.exports = connectToMongo;

/* mongoose.connect('mongodb://127.0.0.1:27017/CG',
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false}
); */