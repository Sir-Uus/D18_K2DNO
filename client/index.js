document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/total-user")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("total-user").textContent = data.totalUser;
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/total-produk")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("total-produk").textContent = data.totalProduk;
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/total-karyawan")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("total-karyawan").textContent = data.totalKaryawan;
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/total-transaksi")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("total-transaksi").textContent = data.totalTransaksi;
    })
    .catch((error) => console.error("Error:", error));
});
