<template>
<div class="content-wrapper">
      <div class="row" >
        <div class="col">
          <div class="card">
            <!-- <img class="card-img" src="assets/img/bg.jpg" alt=""> -->
            <div class="card-body">
              <p class="card-title float-left text-primary"><b>Data yang telah Anda laporkan</b></p>
              <p class="card-description float-right">
                <b-button
                  variant="primary"
                  v-b-modal.modalMasyarakat
                  v-on:click="Add"
                  > Klik disini untuk melapor <i class="mdi mdi-pen btn-icon-prepend"></i></b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="pengaduan" :fields="fields">
                  <template v-slot:cell(status)="data">
                    <b-badge variant="info" style="text-transform: uppercase;">{{ data.item.status }}</b-badge>
                  </template>
                  <template v-slot:cell(kategori)="data">
                    <b-badge variant="primary" style="text-transform: uppercase;">{{ data.item.kategori.nama_kategori }}</b-badge>
                  </template>
                  <template v-slot:cell(tanggal)="data">
                    {{ data.item.tgl_pengaduan | format }}
                  </template>
                  <template v-slot:cell(tanggapan)="data">
                    {{
                      data.item.tanggapan !== null
                        ? data.item.tanggapan.tanggapan
                        : null
                    }}
                  </template>
                  <template v-slot:cell(status)="data">
                                <b-badge variant="info text-white" v-if="data.item.status === 'terkirim'">{{ data.item.status }}</b-badge>
                                <b-badge variant="warning" v-if="data.item.status === 'proses'">{{ data.item.status }}</b-badge>
                                <b-badge variant="success text-white" v-if="data.item.status === 'selesai'">{{ data.item.status }}</b-badge>
                                <b-badge variant="danger" v-if="data.item.status === 'tolak'">{{ data.item.status }}</b-badge>
                  </template>
                  <template v-slot:cell(foto)="data">
                    <img
                      style="width: 200px; height: 100px; border-radius: 5%"
                      :src="'http://localhost:8000/uploads/' + data.item.foto"
                    />
                  </template>
                </b-table>

                <b-modal id="modalMasyarakat" @ok="Save">
                  <template v-slot:modal-title> Form Masyarakat</template>
                 
                  <form ref="form">
          <div class="form-group">
            <div class="form-group">
              <label for="nama" class="col-form-label">Tanggal Pengaduan</label>
              <input type="date" name="tgl_pengaduan" class="form-control" id="tgl_pengaduan" placeholder="Tgl Pengaduan" v-model="tgl_pengaduan">
            </div>
             <div class="form-group">
              <label for="nama" class="col-form-label">Isi Laporan</label>
              <input type="text" name="isi_laporan" class="form-control" id="isi_laporan" placeholder="Isi Laporan" v-model="isi_laporan">
            </div>
             <div class="form-group">
              <label for="nama" class="col-form-label">Lokasi</label>
              <input type="text" name="lokasi" class="form-control" id="lokasi" placeholder="lokasi" v-model="lokasi">
            </div>
            <div class="form-group">
          <label for="id_kategori" class="col-form-label">Kategori</label>
          <select class="form-control" name="id_kategori" id="id_kategori" v-model="id_kategori">
            <option value="1">Lalu Lintas / Jalan Raya</option>
            <option value="2">Fasilitas Umum</option>
            <option value="4">Kebersihan Lingkungan</option>
          </select>
        </div>
             <div class="form-group">
              <label for="foto" class="col-form-label">Foto</label>
              <input type="file" name="foto" class="form-control" id="foto" placeholder="Foto">
            </div>
          </div>
  
        </form>
                </b-modal>

                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="secondary"></b-spinner>
                  <strong class="text-secondary"> Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      search: "",
      id_pengaduan: "",
      id_user: "",
      nama: "",
      tgl_pengaduan: "",
      isi_laporan: "",
      lokasi: "",
      foto: "",
      status: "",
      tanggapan: "",
      id_kategori: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      token: "",
      user: [],
      pengaduan: [],
      kategori: [],
      fields: ["tanggal", "isi_laporan", "kategori", "status", "lokasi", "foto", "tanggapan"],
    };
  },

  methods: {
    getData: function () {
      let conf = { headers: 
      { Authorization: "Bearer " + this.token } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/masyarakat/pengaduan/" + this.perPage + "/" + offset, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide("loadingToast");
            this.pengaduan = response.data.data.pengaduan;
            this.tanggapan = response.data.data.pengaduan.tanggapan;
            this.rows = response.data.data.count;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data Pengaduan.";
            this.$bvToast.show("message");
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

     pagination : function(){
                if(this.search == ""){
                    this.getData();
                } else {
                    this.searching();
                }
            },

    Add: function () {
      this.action = "insert";
      this.id_pengaduan = "";
      this.tgl_pengaduan = "";
      this.isi_laporan = "";
      this.lokasi = "";
      this.id_kategori = "";
      this.foto = "";
      this.getKategoriDropdown();
      document.getElementById("foto").value = null;
    },
     getKategoriDropdown: function(){
                //ambil data kategori untuk dropdown
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                let offset = (this.currentPage - 1) * this.perPage;
                this.axios.get("/masyarakat/kategori/" + this.perPage + "/" + offset, conf)
                .then(response => {
                    let list_kategori = []
                    let json_kategori = response.data.data.kategori
                    json_kategori.forEach(element => {
                        list_kategori.push({value: element.id_kategori, text: element.nama_kategori})
                    });
                    this.kategori = list_kategori
                })
            },
            
      // Save: function(){
      //   let conf = { headers: { Authorization: "Bearer " + this.token } };
      //   this.$bvToast.show("loadingToast");
      //   this.action === "insert";
      //   let form = new FormData();
      //   form.append("id_pengaduan", this.id_pengaduan);
      //   form.append("tgl_pengaduan", this.tgl_pengaduan);
      //   form.append("isi_laporan", this.isi_laporan);
      //   form.append("lokasi", this.lokasi);
      //   form.append("foto", document.getElementById("foto").files[0]);
      //   form.append("id_kategori", this.id_kategori);
        
      // this.axios.post("/masyarakat/pengaduan", form, conf)
      // .then(response => {
      //   console.log(this.foto);
      //   if(!this.foto){
      //     this.$bvToast.hide("loadingToast");
      //     this.message = "Foto Belum Diunggah";
      //     this.$bvToast.show("message");
      //   } else {
      //     this.$bvToast.hide("loadingToast");
      //     this.message = response.data.message;
      //     this.$bvToast.show("message");
      //     this.getData();
      //   }

      // })
      // .catch((error) => {
      //     console.log(error.response);
      //   });
      // },

    Save: function () {
      let conf = { headers: { Authorization: "Bearer " + this.token } };
      this.$bvToast.show("loadingToast");
      this.action === "insert";
      let form = new FormData();
      form.append("id_pengaduan", this.id_pengaduan);
      form.append("tgl_pengaduan", this.tgl_pengaduan);
      form.append("isi_laporan", this.isi_laporan);
      form.append("lokasi", this.lokasi);
      form.append("foto", document.getElementById("foto").files[0]);
      form.append("id_kategori", this.id_kategori);

      this.axios.post("/masyarakat/pengaduan", form, conf)
        .then((response) => {
          this.$bvToast.hide("loadingToast");
          this.message = response.data.message;
          this.$bvToast.show("message");
          this.getData();
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    getKategori() {
      let conf = { headers: { Authorization: "Bearer " + this.token } };
      this.axios.get('kategori', conf).then((response => {
        console.log(response);
        this.kategori = response.data.data.kategori
      }))
    },
  },
  mounted(){
            this.token = localStorage.getItem("Authorization");
            this.getData();
        }
};
</script>