<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <h3 class="card-header d-flex justify-content-between align-items-center">
                        Data Masyarakat
                    </h3>

                    <!-- Light table -->
                    <div class="table-responsive">
                        <b-table striped hover :items="masyarakat" :fields="fields" class="table align-items-center table-flush">
                            <template v-slot:cell(level)="data">
                                <b-badge variant="warning">{{ data.item.level }}</b-badge>
                            </template>
                            <template v-slot:cell(Aksi)="data">
                                <b-button size="sm" v-on:click="Edit(data.item.id)" v-b-modal.modalMasyarakat class="btn btn-outline-primary">Ubah</b-button>&nbsp;
                                <b-button size="sm" v-on:click="Drop(data.item.id)" class="btn btn-outline-danger">Hapus</b-button>
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
        id="modalMasyarakat"
        @ok="Save">
            <template v-slot:modal-title>
            Form Data Masyarakat
            </template>
            <form ref="form">
                <div class="form-group">
                    <label for="nama" class="form-control-label">Nama Patugas</label>
                    <input type="text" v-model="nama" name="nama" class="form-control" id="nama" placeholder="Nama Lengkap">
                </div>
                <div class="form-group">
                    <label for="nik" class="form-control-label">Nik</label>
                    <input type="number" v-model="nik" name="nik" class="form-control" id="nik" placeholder="Nik">
                </div>
                <div class="form-group" v-if="this.action === 'insert'">
                    <label for="username" class="form-control-label">Username</label>
                    <input type="text" v-model="username" name="username" class="form-control" id="username" placeholder="Username">
                </div>
                <div class="form-group" >
                    <label for="password" class="form-control-label">Password</label>
                    <input type="text" v-model="password" name="password" class="form-control" id="password" placeholder="Password">
                </div>
                <div class="form-group">
                    <label for="telp" class="form-control-label">Telepon</label>
                    <input type="text" v-model="telp" name="telp" class="form-control" id="telp" placeholder="Telepon">
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
            id: "",
            nama: "",
            username: "",
            password: "",
            nik: "",
            telp: "",
            level: "",
            action: "",
            message: "",
            currentPage: 1,
            rows: 0,
            perPage: 10,
            token: "",
            masyarakat: [],
            fields: ["id", "nama", "username", "telp", "Aksi", "nik"],
            }
        },

        methods: {
            getData : function(){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                let offset = (this.currentPage - 1) * this.perPage;
                this.message = "Mohon tunggu...";
                this.axios.get("/masyarakat/" + this.perPage + "/" + offset, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.message = "";
                        this.masyarakat= response.data.data.user;
                        this.rows = response.data.data.count;
                    } else {
                        this.message = "Gagal menampilkan data masyarakat."
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
                this.nama = "";
                this.username = "";
                this.password = ""; 
                this.nik = "";
                this.telp = "";
            },

            Edit : function(id){
                let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
                this.axios.get("/masyarakat/" + id, conf)
                .then(response => {
                    if(response.data.success == true){
                        this.action = "update";
                        this.id = response.data.data.user[0].id;
                        this.nama = response.data.data.user[0].nama;
                        this.password = "";
                        this.nik = response.data.data.user[0].nik;
                        this.telp = response.data.data.user[0].telp;
                    } else {
                        this.message = "Gagal menampilkan data masyarakat."
                        this.$router.push({name: "data_siswa"})
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
                    form.append("id", this.id);
                    form.append("nama", this.nama);
                    form.append("username", this.username);
                    form.append("password", this.password);
                    form.append("nik", this.nik);
                    form.append("telp", this.telp);

                    this.axios.post("/masyarakat", form, conf)
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
                        nik: this.nik,
                        nama: this.nama,
                        password: this.password,
                        telp: this.telp
                    }
                    this.axios.put("/masyarakat/" + this.id, form, conf)
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
                    this.axios.delete("/masyarakat/" + id, conf)
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
