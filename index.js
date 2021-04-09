const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();
const port = 5000;

var cors = require('cors')
var cors2 = require('micro-cors')
var router = express.Router();

// app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))
// app.use(bodyParser.json({limit: '50mb', extended: true}))
// app.use(bodyParser.json());
// app.use(router);


// app.use(cors2());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(router);

app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
});

// Configure the bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Configure the CORs middleware
app.use(cors());

/*
    ==GET IMUNISASI BY ID DATA DIRI==
*/
app.get('/getDataImunisasi/:id', (req, res) => {
    const id = req.params.id;
    const details = { 'id_data_diri': id };
    const client = new MongoClient(db.url);
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_imunisasi');
        collection.find(details).toArray((err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    })
})

/*
    ==GET FILTER NAMA ANAK==
*/
app.post('/getDataDiri', (req, res) => {
    const client = new MongoClient(db.url);

    if(req.method === "OPTIONS") {
        res.status(Status.Ok).send("ok")
    }

    const details = { 'nama_anak': new RegExp(req.body.nama_anak, "i") };
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_diri');
        collection.find(details).toArray((err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    })
})


/*
    ==GET ALL DATA DIRI==
*/
app.get('/getDataDiri', (req, res) => {
    const client = new MongoClient(db.url);
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_diri');
        collection.find({}).toArray((err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    })
})

/*
    ==GET ALL IMUNISASI==
*/
app.get('/getAllImunisasi', (req, res) => {
    const client = new MongoClient(db.url);
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_imunisasi');
        collection.find({}).toArray((err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    })
})

/*
    ==INSERT DATA DIRI==
*/
app.post('/insertDataDiri', (req, res) => {
    const client = new MongoClient(db.url);
    console.log(req.body)
    const dataReq = {
        nama_ayah: req.body.nama_ayah,
        nama_ibu: req.body.nama_ibu,
        nama_anak: req.body.nama_anak,
        nik_anak: req.body.nik_anak,
        nik_ortu: req.body.nik_ortu,
        tgl_lahir: req.body.tgl_lahir,
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        no_hp: req.body.no_hp,
        jenis_kelamin: req.body.jenis_kelamin,
        anak_ke: req.body.anak_ke
    };
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_diri');
        collection.insert(dataReq, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    })
})

/*
    ==INSERT DATA IMUNISASI==
*/
app.post('/insertDataImunisasi', (req, res) => {
    const client = new MongoClient(db.url);
    const dataReq = {
        id_data_diri: req.body.id_data_diri,
        tgl_imunisasi: req.body.tgl_imunisasi,
        berat_badan: req.body.berat_badan,
        tinggi_badan: req.body.tinggi_badan,
        umur: req.body.umur,
        vit_A: req.body.vit_A,
        status_gizi: req.body.status_gizi,
        status_ASI: req.body.status_ASI
    };
    client.connect((err) => {
        const db = client.db();
        const collection = db.collection('data_imunisasi');
        collection.insert(dataReq, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    })
})

app.listen(port, () => {
    console.log(`Server is booming on port 5000
    Visit http://localhost:5000`)
})