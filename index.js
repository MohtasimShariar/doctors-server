const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5055;


app.use(cors());
app.use(bodyParser.json());
 app.use(express.static('doctors'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0q8xi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const appointmentCollection = client.db("Drsolar").collection("appointments");
  // perform actions on the collection object

  const doctorCollection = client.db("Drsolar").collection("doctors");

//   client.close();

  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    })
  });
  
app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    const email = req.body.email;
    doctorCollection.find({ email: email })
        .toArray((err, doctors) => {
            const filter = { date: date.date }
            if (doctors.length === 0) {
                filter.email = email;
            }
            appointmentCollection.find(filter)
                .toArray((err, documents) => {
                    console.log(email, date.date, doctors, documents)
                    res.send(documents);
                })
        })
})

app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    doctorCollection.insertOne({ name, email, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

app.get('/doctors', (req, res) => {
    doctorCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.post('/isDoctor', (req, res) => {
    const email = req.body.email;
    doctorCollection.find({ email: email })
        .toArray((err, doctors) => {
            res.send(doctors.length > 0);
        })
})

  

});

app.get("/", (req, res) => {
  res.send("HIII It's all okkk");
});

app.listen(process.env.PORT || port)



// app.post('/addAppointment', (req, res) => {
//     const appointment = req.body;
//     appointmentCollection.insertOne(appointment)
//         .then(result => {
//             res.send(result.insertedCount > 0)
//         })
// });

// app.get('/appointments', (req, res) => {
//     appointmentCollection.find({})
//         .toArray((err, documents) => {
//             res.send(documents);
//         })
// })

// app.post('/appointmentsByDate', (req, res) => {
//     const date = req.body;
//     const email = req.body.email;
//     doctorCollection.find({ email: email })
//         .toArray((err, doctors) => {
//             const filter = { date: date.date }
//             if (doctors.length === 0) {
//                 filter.email = email;
//             }
//             appointmentCollection.find(filter)
//                 .toArray((err, documents) => {
//                     console.log(email, date.date, doctors, documents)
//                     res.send(documents);
//                 })
//         })
// })

// app.post('/addADoctor', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;
//     const newImg = file.data;
//     const encImg = newImg.toString('base64');

//     var image = {
//         contentType: file.mimetype,
//         size: file.size,
//         img: Buffer.from(encImg, 'base64')
//     };

//     doctorCollection.insertOne({ name, email, image })
//         .then(result => {
//             res.send(result.insertedCount > 0);
//         })
// })

// app.get('/doctors', (req, res) => {
//     doctorCollection.find({})
//         .toArray((err, documents) => {
//             res.send(documents);
//         })
// });

// app.post('/isDoctor', (req, res) => {
//     const email = req.body.email;
//     doctorCollection.find({ email: email })
//         .toArray((err, doctors) => {
//             res.send(doctors.length > 0);
//         })
// })
