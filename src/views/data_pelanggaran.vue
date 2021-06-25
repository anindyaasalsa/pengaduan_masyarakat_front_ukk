<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <h3 class="card-header d-flex justify-content-between align-items-center">
                        Data Kategori
                        <button class="btn btn-icon btn-primary" type="button" v-b-modal.modalkategori v-on:click="Add">
                            <span class="btn-inner--icon"><i class="fa fa-plus"></i></span>
                            <span class="btn-inner--text">Tambah</span>
                        </button>
                    </h3>

                    <!-- Light table -->
                    <div class="table-responsive">
                        <b-table striped hover :items="kategori" :fields="fields" class="table align-items-center table-flush">
                            <template v-slot:cell(Aksi)="data">
                                <b-button size="sm" v-on:click="Edit(data.item.id_kategori)" v-b-modal.modalkategori class="btn btn-outline-primary">Ubah</b-button>&nbsp;
                                <b-button size="sm" v-on:click="Drop(data.item.id_kategori)" class="btn btn-outline-danger">Hapus</b-button>
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
        id="modalkategori"
        @ok="Save">
            <template v-slot:modal-title>
            Form Data kategori
            </template>
            <form ref="form">
                <div class="form-group">
                    <label for="nama_kategori" class="form-control-label">Nama Kategori</label>
                    <input type="text" v-model="nama_kategori" name="nama_kategori" class="form-control" id="nama_kategori" placeholder="Nama Kategori">
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
            id_kategori: "",
            nama_kategori: "",
            action: "",
            message: "",
            currentPage: 1,
            rows: 0,
            perPage: 10,
            token: "",
            kategori: [],
            fields: ["id_kategori", "nama_kategori", "Aksi"],
            }
        },

        methods: {
            getData : function(){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                let offset = (this.currentPage - 1) * this.perPage;
                this.message = "Mohon tunggu...";
                this.axios.get("/kategori/" + this.perPage + "/" + offset, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.message = "";
                        this.kategori = response.data.data.kategori;
                        this.rows = response.data.data.count;
                    } else {
                        this.message = "Gagal menampilkan data kategori."
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

            Add : function(){
                this.action = "insert";
                this.nama_kategori = "";
            },

            Edit : function(id){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                this.axios.get("/kategori/" + id, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.action = "update";
                        this.id_kategori = response.data.data.kategori[0].id_kategori;
                        this.nama_kategori = response.data.data.kategori[0].nama_kategori;
                    } else {
                        this.message = "Gagal menampilkan data kategori."
                        this.$router.push({name: "kategori"})
                    }
                })
                .catch(error => {
                    console.log(error);
                });

                
            },

            Save : function(){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                this.$bvToast.show("loadingToast");
                if(this.action === "insert"){
                    let form = new FormData();
                    form.append("nama_kategori", this.nama_kategori);

                    this.axios.post("/kategori", form, conf)
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
                        nama_kategori: this.nama_kategori,
                    }
                    this.axios.put("/kategori/" + this.id_kategori, form, conf)
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
                    this.axios.delete("/kategori/" + id, conf)
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
