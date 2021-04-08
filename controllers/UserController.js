class UserController {

    constructor(FormId, tableId) {

        this.formEl = document.getElementById(FormId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => {
            event.preventDefault();

            this.addLine(this.getValues());
        });

    }

    getValues() {

        // let -> só existe dentro do método
        let user = {};

        [...this.formEl.elements].forEach(function (field, index) {

            //código
            if (field.name == "gender") {

                // field.checked === true ou simplesmente field.checked
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });

        // um objeto é variável que estancia uma classe
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }

    addLine(dataUser) {

        this.tableEl.innerHTML = `
        <tr>
            <td><img src = "dist/img/user1-128x128.jpg" alt = "User Image" class = "img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td> 
            <td>${dataUser.birth}</td> 
            <td>
                <button type = "button" class = "btn btn-primary btn-xs btn-flat"> Editar </button>
                <button type = "button" class = "btn btn-danger btn-xs btn-flat"> Excluir </button>
            </td> 
        </tr>
    `;

    }

}