const express = require("express");
const session = require("express-session");
const app = express();
//const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

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
  res.sendFile(path.join(__dirname, "..", "client", "/index.html"));
});

app.set("views", path.join(__dirname, "..", "client", "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "aJw2$wf?I9*2D?#dFfSte@s%td",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  if (req.session.user && req.session.user.role) {
    req.user = { role: req.session.user.role };
  } else {
    req.user = { role: "defaultRole" };
  }
  next();
});

function checkAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
}
function mustAdmin(req, res, next) {
  if (req.session && req.session.user.role === "admin") {
    return next();
  }
  res.redirect("/transaksi");
}

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = dbService.getDbServiceInstance();

  const user = await db.login(username, password);
  if (user) {
    const secret = crypto.createHash("md5").update(username).digest("hex");

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).send("Session regeneration error");
      }
      req.session.secret = secret;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          return res.status(500).send("Session save error");
        }
        res.redirect("/dashboard");
        console.log(req.session);
      });
    });
  } else {
    res.status(401).send("Invalid username or password");
  }
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// dashboard
app.get("/dashboard", checkAuthenticated, (req, res) => {
  var userRole = req.session.user.role;
  res.render("dashboard/index", { role: userRole });
});

//HOME
app.get("/home", checkAuthenticated, (req, res) => {
  var userRole = req.session.user.role;
  res.render("home/index", { role: userRole });
});

// PRODUK Table
app.get("/produk", checkAuthenticated, mustAdmin, (req, res) => {
  const db = dbService.getDbServiceInstance();
  var userRole = req.session.user.role;

  db.getAllProduk()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("produk/indexProduk", { myProduk: data, role: userRole });
    })
    .catch((err) => {
      console.log(err);
      res.render("produk/indexProduk", { myProduk: [] });
    });
});

app.post("/produk/insert", checkAuthenticated, mustAdmin, (req, res) => {
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

app.get("/produk/edit/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/produk/update/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/produk/delete/:id", checkAuthenticated, mustAdmin, (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteProdukById(id);

  result.then(res.redirect("/produk")).catch((err) => console.log(err));
});

//Transaksi
app.get("/transaksi", checkAuthenticated, (req, res) => {
  const db = dbService.getDbServiceInstance();
  var userRole = req.session.user.role;

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
                role: userRole,
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

app.post("/transaksi/insert", checkAuthenticated, (req, res) => {
  const { id_produk, quantity, tanggal, id_karyawan } = req.body;
  console.log(req.body);

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

app.get("/karyawan", checkAuthenticated, mustAdmin, (req, res) => {
  const db = dbService.getDbServiceInstance();
  var userRole = req.session.user.role;

  db.getAllKaryawan()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("karyawan/indexKaryawan", { karyawans: data, role: userRole });
    })
    .catch((err) => {
      console.log(err);
      res.render("karyawan/indexKaryawan", { karyawans: [] });
    });
});

app.post("/karyawan/insert", checkAuthenticated, mustAdmin, (req, res) => {
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

app.get("/karyawan/edit/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/karyawan/update/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/karyawan/delete/:id", checkAuthenticated, mustAdmin, (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteKaryawanById(id);

  result.then(res.redirect("/karyawan")).catch((err) => console.log(err));
});

app.get("/investor", checkAuthenticated, mustAdmin, (req, res) => {
  const db = dbService.getDbServiceInstance();
  var userRole = req.session.user.role;

  db.getAllInvestor()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("investor/indexInvestor", { investors: data, role: userRole });
    })
    .catch((err) => {
      console.log(err);
      res.render("investor/indexInvestor", { investors: [] });
    });
});

app.post("/investor/insert", checkAuthenticated, mustAdmin, (req, res) => {
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

app.get("/investor/edit/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/investor/update/:id", checkAuthenticated, mustAdmin, (req, res) => {
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

app.post("/investor/delete/:id", checkAuthenticated, mustAdmin, (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteInvestorById(id);

  result.then(res.redirect("/investor")).catch((err) => console.log(err));
});

app.get("/user", checkAuthenticated, (req, res) => {
  const db = dbService.getDbServiceInstance();
  var userRole = req.session.user.role;

  db.getAllUser()
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("Error:", data);
        data = [];
      }
      res.render("user/indexUser", { users: data, role: userRole });
    })
    .catch((err) => {
      console.log(err);
      res.render("user/indexUser", { users: [] });
    });
});

app.post("/user/insert", checkAuthenticated, (req, res) => {
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

app.get("/user/edit/:id", checkAuthenticated, (req, res) => {
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

app.post("/user/update/:id", checkAuthenticated, (req, res) => {
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

app.post("/user/delete/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteUserById(id);

  result.then(res.redirect("/user")).catch((err) => console.log(err));
});

app.get("/api/total-user", checkAuthenticated, (req, res) => {
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

app.get("/api/total-produk", checkAuthenticated, (req, res) => {
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

app.get("/api/total-karyawan", checkAuthenticated, (req, res) => {
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

app.get("/api/total-transaksi", checkAuthenticated, (req, res) => {
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
