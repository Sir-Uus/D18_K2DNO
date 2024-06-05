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

app.get("/login", (req, res) => {
  res.render("login/login");
});
app.get("/register", (req, res) => {
  res.render("login/register");
});
app.get("/forgot", (req, res) => {
  res.render("login/forgot");
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
    .then((dataTransaksi) => {
      if (!Array.isArray(dataTransaksi)) {
        console.log("Error:", dataTransaksi);
        dataTransaksi = [];
      }

      db.getAllProduk()
        .then((dataProduk) => {
          if (!Array.isArray(dataProduk)) {
            console.log("Error:", dataProduk);
            dataProduk = [];
          }

          db.getAllKaryawan()
            .then((dataKaryawan) => {
              if (!Array.isArray(dataKaryawan)) {
                console.log("Error:", dataKaryawan);
                dataKaryawan = [];
              }

              res.render("transaksi/indexTransaksi", {
                transaksi: dataTransaksi,
                produk: dataProduk,
                karyawan: dataKaryawan,
              });
            })
            .catch((err) => {
              console.log(err);
              res.render("transaksi/indexTransaksi", {
                transaksi: [],
                produk: [],
                karyawan: [],
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.render("transaksi/indexTransaksi", {
            transaksi: [],
            produk: [],
            karyawan: [],
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.render("transaksi/indexTransaksi", {
        transaksi: [],
        produk: [],
        karyawan: [],
      });
    });
});

app.post("/transaksi/insert", (req, res) => {
  const { id_produk, quantity, tanggal, id_karyawan } = req.body;
  console.log(req.body)
  
  const db = dbService.getDbServiceInstance();

  db.insertNewTransaksi(id_produk, quantity, tanggal, id_karyawan)
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

  db.updateKaryawanById(
    id,
    nama_karyawan,
    tgl_lahir,
    jenis_kelamin,
    alamat,
    noTlp
  )
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

app.get("/api/total-user", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.TotalUser()
    .then((count) => {
      res.json({ totalUser: count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/total-produk", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.TotalProduk()
    .then((count) => {
      res.json({ totalProduk: count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/total-karyawan", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.TotalKaryawan()
    .then((count) => {
      res.json({ totalKaryawan: count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/total-transaksi", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.TotalTransaksi()
    .then((count) => {
      res.json({ totalTransaksi: count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(process.env.PORT, () => console.log("APP IS RUNNING"));
