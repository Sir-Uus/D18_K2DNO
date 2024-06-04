const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db " + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  // GET ALL=======================================================================================================================
  async getAllProduk() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM dataproduk;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllTransaksi() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM datatransaksi;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllKaryawan() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_karyawan;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllInvestor() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_investor;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllUser() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_user;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  //INSERT========================================================================================================================
  async insertNewProduk(namaproduk, stock, hargasatuan) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO dataproduk (namaproduk, stock, hargasatuan) VALUES (?,?,?);";
        connection.query(query, [namaproduk, stock, hargasatuan], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });
      return {
        id_produk: insertId,
        namaproduk: namaproduk,
        stock: stock,
        hargasatuan: hargasatuan,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async insertNewTransaksi(id_produk, quantity, tanggal, id_karyawan) {
    try {
      const hargaSatuan = await new Promise((resolve, reject) => {
        const queryHarga = "SELECT hargasatuan FROM dataproduk WHERE id_produk = ?;";
        connection.query(queryHarga, [id_produk], (err, result) => {
          if (err) {
            console.error("Error fetching harga satuan:", err.message);
            reject(new Error(err.message));
          } else {
            resolve(result[0].hargasatuan);
          }
        });
      });

      const hargatotal = hargaSatuan * quantity;

      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO datatransaksi (id_produk, quantity, tanggal, hargatotal, id_karyawan) VALUES (?,?,?,?,?);";
        connection.query(query, [id_produk, quantity, tanggal, hargatotal, id_karyawan], (err, result) => {
          if (err) {
            console.error("Error inserting new transaksi:", err.message);
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });

      return {
        id: insertId,
        id_produk: id_produk,
        quantity: quantity,
        tanggal: tanggal,
        hargatotal: hargatotal,
        id_karyawan: id_karyawan,
      };
    } catch (error) {
      console.error("Transaction insertion failed:", error);
      return null;
    }
  }

  async insertNewKaryawan(nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO data_karyawan (nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp) VALUES (?,?,?,?,?);";
        connection.query(query, [nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });
      return {
        id: insertId,
        nama_karyawan: nama_karyawan,
        tgl_lahir: tgl_lahir,
        jenis_kelamin: jenis_kelamin,
        alamat: alamat,
        noTlp: noTlp,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async insertNewInvestor(nama, jumlah) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO data_investor (nama, jumlah) VALUES (?,?);";
        connection.query(query, [nama, jumlah], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });
      return {
        id: insertId,
        nama: nama,
        jumlah: jumlah,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async insertNewUser(nama, username, password, kontak, role) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO data_user (nama, username, password, kontak, role) VALUES (?,?,?,?,?);";
        connection.query(query, [nama, username, password, kontak, role], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });
      return {
        id: insertId,
        nama: nama,
        username: username,
        password: password,
        kontak: kontak,
        role: role,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //DELETE=============================================================================================================================
  async deleteKaryawanById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM data_karyawan WHERE id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteProdukById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM dataproduk WHERE id_produk = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteInvestorById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM data_investor WHERE id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteUserById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM data_user WHERE id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //GET===================================================================================================================================
  async getProdukById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM dataproduk WHERE id_produk = ?";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results[0]);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getKaryawanById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_karyawan WHERE id = ?";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results[0]);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getInvestorById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_investor WHERE id = ?";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results[0]);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_user WHERE id = ?";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results[0]);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //UPDATE========================================================================================================================
  async updateProdukById(id, namaproduk, stock, hargasatuan) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE dataproduk SET namaproduk = ?, stock = ?,hargasatuan = ? WHERE id_produk = ?;";

        connection.query(query, [namaproduk, stock, hargasatuan, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateKaryawanById(id, nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE data_karyawan SET nama_karyawan = ?, tgl_lahir = ?,jenis_kelamin = ?, alamat = ?, noTlp= ? WHERE id = ?;";

        connection.query(query, [nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateInvestorById(id, nama, jumlah) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE data_investor SET nama = ?, jumlah = ? WHERE id = ?;";

        connection.query(query, [nama, jumlah, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateUserById(id, nama, username, password, kontak, role) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE data_user SET nama = ?, username = ?, password = ?, kontak = ?, role = ? WHERE id = ?;";

        connection.query(query, [nama, username, password, kontak, role, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //TOTAL UNTUK DI DASHBOARD======================================================================================================
  async TotalUser() {
    try {
      const query = "SELECT COUNT(*) AS totalUser FROM data_user";
      const result = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          resolve(results[0].totalUser);
        });
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  async TotalProduk() {
    try {
      const query = "SELECT COUNT(*) AS totalProduk FROM dataproduk";
      const result = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          resolve(results[0].totalProduk);
        });
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  async TotalKaryawan() {
    try {
      const query = "SELECT COUNT(*) AS totalKaryawan FROM data_karyawan";
      const result = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          resolve(results[0].totalKaryawan);
        });
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  async TotalTransaksi() {
    try {
      const query = "SELECT COUNT(*) AS totalTransaksi FROM datatransaksi";
      const result = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          resolve(results[0].totalTransaksi);
        });
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}

module.exports = DbService;
