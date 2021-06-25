<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <h3 class="card-header d-flex justify-content-between align-items-center">
                        Data Pengaduan
                    </h3>

                    <!-- Light table -->
                    <div class="table-responsive">
                        <b-table striped hover :items="pengaduan" :fields="fields" class="table align-items-center table-flush">
                            <template v-slot:cell(kategori)="data">
                                <b-badge variant="warning">{{ data.item.kategori.nama_kategori }}</b-badge>
                            </template>
                            <template v-slot:cell(status)="data">
                                <b-badge variant="info" v-if="data.item.status === 'terkirim'">{{ data.item.status }}</b-badge>
                                <b-badge variant="warning" v-if="data.item.status === 'proses'">{{ data.item.status }}</b-badge>
                                <b-badge variant="success" v-if="data.item.status === 'selesai'">{{ data.item.status }}</b-badge>
                                <b-badge variant="danger" v-if="data.item.status === 'tolak'">{{ data.item.status }}</b-badge>
                            </template>
                            <template v-slot:cell(Aksi)="data">
                                <b-button size="sm" v-on:click="Lihat(data.item.id_pengaduan)" v-b-modal.modallihat class="btn btn-outline-info">Lihat</b-button>&nbsp;
                                <b-button size="sm" v-if="data.item.status === 'terkirim'" v-on:click="Add(data.item.id_pengaduan)" class="btn btn-outline-danger">Tanggapan</b-button>
                            </template>
                        </b-table>

                        <div class="text-center my-3">
                            <small class="text-red">{{ message }}</small>
                        </div>

                        <b-pagination
                        v-model="currentPage"
                        :per-page="perPage"
                        :total-rows="rows"
                        align="center"
                        v-on:input="pagination">
                        </b-pagination>

                    </div>

                </div>
            </div>
        </div>
        <b-modal 
        id="modalpengaduan"
        size="lg"
        @ok="Save">
            <template v-slot:modal-title>
            Form Data Tanggapan
            </template>
            <form ref="form" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="id_pengaduan" class="form-control-label">Id Pengaduan</label>
                    <input type="text" v-model="id_pengaduan" name="id_pengaduan" class="form-control" id="id_pengaduan" placeholder="Id Pengaduan">
                </div>
                <div class="form-group">
                    <label for="tanggapan" class="form-control-label">Tanggapan</label>
                    <input type="text" v-model="tanggapan" name="tanggapan" class="form-control" id="tanggapan" placeholder="Tanggapan">
                </div>
            </form>
        </b-modal>

         <b-modal 
        id="modallihat"
        size="lg"
        hide-footer>
            <template v-slot:modal-title>
                Detail Pengaduan 
                <b-badge variant="info" v-if="status === 'terkirim'">{{ status }}</b-badge>
                <b-badge variant="warning" v-if="status === 'proses'">{{ status }}</b-badge>
                <b-badge variant="success" v-if="status === 'selesai'">{{ status }}</b-badge>
                <b-badge variant="danger" v-if="status === 'tolak'">{{ status }}</b-badge>
            </template>
            <form ref="form">
                <div class="form-group">
                    <label for="tgl_pengaduan_detail" class="form-control-label">Tanggal Pengaduan</label>
                    <input type="date" readonly v-model="tgl_pengaduan" name="tgl_pengaduan" class="form-control" id="tgl_pengaduan_detail">
                </div>
                <div class="form-group">
                    <label for="isi_laporan_detail" class="form-control-label">Isi Laporan</label>
                    <textarea readonly v-model="isi_laporan" class="form-control" id="isi_laporan_detail"></textarea>
                </div>
                <div class="form-group">
                    <label for="id_kategori_detail" class="col-form-label">Kategori</label>
                    <b-form-select disabled id="id_kategori_detail" v-model="id_kategori" :options="kategori"></b-form-select>
                </div>
                
            </form>
        </b-modal>
    </div>
</template>
<script>
    module.exports = {
        data : function(){
            return {
            search: "",
            id_pengaduan: "",
            isi_laporan: "",
            tgl_pengaduan: "",
            id_kategori: "",
            status: "",
            tanggapan: "",
            action: "",
            message: "",
            currentPage: 1,
            rows: 0,
            perPage: 10,
            token: "",
            pengaduan: [],
            kategori: [],
            fields: ["id_pengaduan", "Aksi", "tgl_pengaduan", "isi_laporan", "kategori", "status"],
            }
        },

        methods: {
            getData : function(){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                let offset = (this.currentPage - 1) * this.perPage;
                this.message = "Mohon tunggu...";
                this.axios.get("/pengaduan/" + this.perPage + "/" + offset, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.message = "";
                        this.pengaduan = response.data.data.pengaduan;
                        this.rows = response.data.data.count;
                    } else {
                        this.message = "Gagal menampilkan data pengaduan."
                        this.$router.push({name: "login"})
                    }
                    
                })
                .catch(error => {
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

            getKategoriDropdown: function(){
                //ambil data kategori untuk dropdown
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                this.axios.get("/kategori", conf)
                .then(response => {
                    let list_kategori = []
                    let json_kategori = response.data.data.kategori
                    json_kategori.forEach(element => {
                        list_kategori.push({value: element.id_kategori, text: element.nama_kategori})
                    });
                    this.kategori = list_kategori
                })
            },

            Add : function(){
                this.action = "insert";
                this.tanggapan = "";
                this.getKategoriDropdown();
            },

            Lihat : function(id){
                this.getKategoriDropdown()

                let conf = { headers: { "Authorization" : 'Bearer ' + this.token , 'content-type':'multipart/form-data'} };
                this.axios.get("/pengaduan/" + id, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.action = "update";
                        this.id_kategori = response.data.data.pengaduan[0].id_kategori;
                        this.isi_laporan = response.data.data.pengaduan[0].isi_laporan;
                        this.tgl_pengaduan = response.data.data.pengaduan[0].tgl_pengaduan;
                        this.status = response.data.data.pengaduan[0].status;
                    } else {
                        this.message = "Gagal menampilkan data pengaduan."
                        this.$router.push({name: "pengaduan"})
                    }
                })
                .catch(error => {
                    console.log(error);
                });
                
            },

            Save : function(){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token , 'content-type':'multipart/form-data'} };
                if(this.action === "insert"){
                    let form = new FormData();
                    form.append("id_pengaduan", this.id_pengaduan);
                    form.append("isi_laporan", this.isi_laporan);

                    this.axios.post("/pengaduan", form, conf)
                    .then(response => {
                        this.message = "Mohon tunggu...";
                        if(this.search == ""){
                            this.getData();
                        } else {
                            this.searching();
                        }
                        this.message = "";
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    let form = {
                        isi_laporam: this.isi_laporam,
                        tgl_pengaduan: this.tgl_pengaduan,
                        id_kategori: this.id_kategori,
                    }
                    this.axios.put("/pengaduan/" + this.id_pengaduan, form, conf)
                    .then(response => {
                        this.message = "Mohon tunggu...";
                        if(this.search == ""){
                            this.getData();
                        } else {
                            this.searching();
                        }
                        this.message = "";
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            },

            Drop : function(id){
                let conf = { headers: { "Authorization" : "Bearer " + this.token} };
                if(confirm('Apakah anda yakin ingin menghapus data ini?')){
                    this.message = "Mohon tunggu...";
                    this.axios.delete("/pengaduan/" + id, conf)
                    .then(response => {
                        this.getData();
                        this.message = "";
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            },
        },
        mounted(){
            this.token = localStorage.getItem("Authorization");
            this.getData();
        }
    }
</script>
