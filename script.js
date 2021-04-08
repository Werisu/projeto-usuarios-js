/**
 * CSS
 * Autor: Wellysson Nascimento Rocha
 */

var nome = document.querySelector("#exampleInputName");

/*nome.value = "Wellysson N Rocha";
nome.style.color = "blue";*/

var genreMasc = document.querySelector("#exampleInputGenderM");
var gender = document.querySelectorAll("#form-user-create [name = gender]:checked");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail");
var birth = document.querySelector("#exampleInputBirth");
var password = document.querySelector("#exampleInputPassword");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");

var user = {}; // objeto literal - Criando JSON
var fields = document.querySelectorAll("#form-user-create [name]");

function addLine(dataUser) {

    console.log(dataUser);

    //var tbody = document.createElement("tr");

    document.getElementById("table-users").innerHTML = `
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

// let cursos = [1, 2, 3, 4];

// cursos.forEach((value) => {
//     console.log(value);
// });

document.getElementById("form-user-create").addEventListener("submit", function (event) {
    event.preventDefault();

    fields.forEach(function (field, index) {

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
    var objectUser = new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    addLine(objectUser);
});