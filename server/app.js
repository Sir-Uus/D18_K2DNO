const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Agar bisa akses file statis dari direktori client
app.use(express.static(path.join(__dirname, "..", "client")));

// Akses Bootstrap
app.get("/css/bootstrap.css", (req, res) => {
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/css/bootstrap.css");
});
app.get("/js/bootstrap.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/js/bootstrap.js");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.set("views", path.join(__dirname, "..", "client", "views"));
app.set("view engine", "ejs");
//HOME
app.get("/home", (req, res) => {
  res.render("home/index");
});
// PRODUK Table
app.get("/produk", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.getAllProduk()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("produk/indexProduk", { myProduk: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("produk/indexProduk", { myProduk: [] });
    });
});

app.post("/produk/insert", (req, res) => {
  const { namaproduk, stock, hargasatuan } = req.body;
  const db = dbService.getDbServiceInstance();

  db.insertNewProduk(namaproduk, stock, hargasatuan)
    .then((insertedData) => {
      if (insertedData) {
        res.redirect("/produk");
      } else {
        res.status(500).send("gagal!");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error");
    });
});

app.get("/produk/edit/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  db.getProdukById(id)
    .then((produk) => {
      if (produk) {
        res.render("produk/updateProduk", { produk });
      } else {
        res.status(404).send("error");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Errorr");
    });
});

app.post("/produk/update/:id", (req, res) => {
  const { id } = req.params;
  const { namaproduk, stock, hargasatuan } = req.body;
  const db = dbService.getDbServiceInstance();

  db.updateProdukById(id, namaproduk, stock, hargasatuan)
    .then(res.redirect("/produk"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

app.post("/produk/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteProdukById(id);

  result.then(res.redirect("/produk")).catch((err) => console.log(err));
});

//Transaksi
app.get("/transaksi", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.getAllTransaksi()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("transaksi/indexTransaksi", { transaksi: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("transaksi/indexTransaksi", { transaksi: [] });
    });
});

app.post("/transaksi/insert", (req, res) => {
  const { idproduk, quantity, tanggal, hargatotal, id_karyawan } = req.body;
  const db = dbService.getDbServiceInstance();

  db.insertNewTransaksi(idproduk, quantity, tanggal, hargatotal, id_karyawan)
    .then((insertedData) => {
      if (insertedData) {
        res.redirect("/transaksi");
      } else {
        res.status(500).send("gagal!");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error");
    });
});

// app.get("/transaksi/edit/:id", (req, res) => {
//   const { id } = req.params;
//   const db = dbService.getDbServiceInstance();

//   db.getTransaksiById(id)
//     .then((transaksi) => {
//       if (transaksi) {
//         res.render("updateTransaksi", { transaksi });
//       } else {
//         res.status(404).send("Erro");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Errorr");
//     });
// });

app.get("/karyawan", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.getAllKaryawan()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("karyawan/indexKaryawan", { karyawans: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("karyawan/indexKaryawan", { karyawans: [] });
    });
});

app.post("/karyawan/insert", (req, res) => {
  const { nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp } = req.body;
  const db = dbService.getDbServiceInstance();

  db.insertNewKaryawan(nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp)
    .then((insertedData) => {
      if (insertedData) {
        res.redirect("/karyawan");
      } else {
        res.status(500).send("gagal!");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error");
    });
});

app.get("/karyawan/edit/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  db.getKaryawanById(id)
    .then((karyawan) => {
      if (karyawan) {
        res.render("karyawan/updateKaryawan", { karyawan });
      } else {
        res.status(404).send("errror");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Errorr");
    });
});

app.post("/karyawan/update/:id", (req, res) => {
  const { id } = req.params;
  const { nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp } = req.body;
  const db = dbService.getDbServiceInstance();

  db.updateKaryawanById(id, nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp)
    .then(res.redirect("/karyawan"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

app.post("/karyawan/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteKaryawanById(id);

  result.then(res.redirect("/karyawan")).catch((err) => console.log(err));
});

app.get("/investor", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.getAllInvestor()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("investor/indexInvestor", { investors: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("investor/indexInvestor", { investors: [] });
    });
});

app.post("/investor/insert", (req, res) => {
  const { nama, jumlah } = req.body;
  const db = dbService.getDbServiceInstance();

  db.insertNewInvestor(nama, jumlah)
    .then((insertedData) => {
      if (insertedData) {
        res.redirect("/investor");
      } else {
        res.status(500).send("gagal!");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error");
    });
});

app.get("/investor/edit/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  db.getInvestorById(id)
    .then((investor) => {
      if (investor) {
        res.render("investor/updateinvestor", { investor });
      } else {
        res.status(404).send("errror");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Errorr");
    });
});

app.post("/investor/update/:id", (req, res) => {
  const { id } = req.params;
  const { nama, jumlah } = req.body;
  const db = dbService.getDbServiceInstance();

  db.updateInvestorById(id, nama, jumlah)
    .then(res.redirect("/investor"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

app.post("/investor/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteInvestorById(id);

  result.then(res.redirect("/investor")).catch((err) => console.log(err));
});

app.get("/user", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.getAllUser()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("user/indexUser", { users: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("user/indexUser", { users: [] });
    });
});

app.post("/user/insert", (req, res) => {
  const { nama, username, password, kontak, role } = req.body;
  const db = dbService.getDbServiceInstance();

  db.insertNewUser(nama, username, password, kontak, role)
    .then((insertedData) => {
      if (insertedData) {
        res.redirect("/user");
      } else {
        res.status(500).send("gagal!");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error");
    });
});

app.get("/user/edit/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  db.getUserById(id)
    .then((user) => {
      if (user) {
        res.render("user/updateuser", { user });
      } else {
        res.status(404).send("errror");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Errorr");
    });
});

app.post("/user/update/:id", (req, res) => {
  const { id } = req.params;
  const { nama, username, password, kontak, role } = req.body;
  const db = dbService.getDbServiceInstance();

  db.updateUserById(id, nama, username, password, kontak, role)
    .then(res.redirect("/user"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

app.post("/user/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteUserById(id);

  result.then(res.redirect("/user")).catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => console.log("APP IS RUNNING"));
