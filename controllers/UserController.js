class UserController {

    constructor(FormIdCreate, FormIdUpdate, tableId) {

        this.formEl = document.getElementById(FormIdCreate);
        this.formUpdateEl = document.getElementById(FormIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }

    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click",
            e => {
                this.showPanelCreate();
            });

        this.formUpdateEl.addEventListener("submit", e => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type='submit']");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

            console.log(result);

            this.getPhoto(this.formUpdateEl).then((content) => {

                if (!values.photo) {
                    result._photo = userOld._photo;
                } else {
                    result._photo = content;
                }

                let user = new User();

                user.loadFromJSON(result);

                this.addTrTemplate(user, tr);

                this.updateCount();

                this.formUpdateEl.reset();

                this.showPanelCreate();

                btn.disabled = false;
            }, (e) => {
                console.error(e);
            });
        });

    }

    onClear() {

    }

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type='submit']");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) return false;

            this.getPhoto(this.formEl).then((content) => {
                values.photo = content;

                this.insert(values);

                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;
            }, (e) => {
                console.error(e);
            });

        });

    }

    getPhoto(formEl) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg'); //imagem padrão se n tiver imagem
            }

        });

    }

    getValues(formEl) {

        // let -> só existe dentro do método
        let user = {};
        let isValid = true;

        //Spread 
        [...formEl.elements].forEach(function (field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add("has-error");
                isValid = false; // interrompe o formulário

            }

            //código
            if (field.name == "gender") {

                // field.checked === true ou simplesmente field.checked
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name === "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false; // não envia formulário
        }

        // um objeto é variável que estancia uma classe
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }

    getUsersStorage() {

        //let users = new Array() também está correto
        let users = [];

        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;

    }

    selectAll() {

        let users = this.getUsersStorage();

        users.forEach(dataUser => {

            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);

        });

    }

    insert(data) {

        let users = this.getUsersStorage();

        users.push(data);

        // chave - valor
        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users));

    }

    addLine(dataUser) {

        let tr = this.addTrTemplate(dataUser);

        /*
         o dataset guarda os dados como string, então para salvar esse objeto vai ser preciso
         serializar, ou seja, transformar um objeto em texto para depois
         recuperar esse objeto utilizando JSON.stringify
        */

        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    addTrTemplate(dataUser, tr = null) {

        if (tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src = "${dataUser.photo}" alt = "User Image" class = "img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td> 
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type = "button" class = "btn btn-primary btn-xs btn-flat btn-edit"> Editar </button>
                <button type = "button" class = "btn btn-danger btn-xs btn-flat btn-delete"> Excluir </button>
            </td>
    `;

        this.addEventsTr(tr);

        return tr;

    }

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja realmente excluir?")) {

                tr.remove();

                this.updateCount();

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break
                        default:
                            field.value = json[name];
                    }
                }

            }

            let imgForm = this.formUpdateEl.querySelector(".photo");

            console.log(json._photo);

            imgForm.src = json._photo;

            imgForm.style.height = "50px";

            this.showPanelUpdate();
        });

    }

    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            /* recuperando o objeto de string para objeto utilizando
            JSON.parse */

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }

}