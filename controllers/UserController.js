class UserController {

    constructor(FormId, tableId) {

        this.formEl = document.getElementById(FormId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => {
            event.preventDefault();

            let btn = this.formEl.querySelector("[type='submit']");

            btn.disabled = true

            let values = this.getValues();

            this.getPhoto().then((content) => {
                values.photo = content;

                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;
            }, (e) => {
                console.error(e);
            });

        });

    }

    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {
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

    getValues() {

        // let -> só existe dentro do método
        let user = {};

        //Spread 
        [...this.formEl.elements].forEach(function (field, index) {

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

        // um objeto é variável que estancia uma classe
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }

    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src = "${dataUser.photo}" alt = "User Image" class = "img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td> 
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type = "button" class = "btn btn-primary btn-xs btn-flat"> Editar </button>
                <button type = "button" class = "btn btn-danger btn-xs btn-flat"> Excluir </button>
            </td>
    `;

        this.tableEl.appendChild(tr);

    }

}