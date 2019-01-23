function authenticate() {
    var login = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var not_found = 1;

    getUserList(function(users) {
        for(var i in users) {
            let u = users[i];

            if (u.email == login && u.password == senha && u.profile_type == 2) {
                $("#entirecontent").load("../pages/dashboard_cliente.html", function() {
                    $("#produtos_logged").load("../pages/dashboard_cliente_content.html");
                });
                not_found = 0;
                break;
            }
            if (u.email == login && u.password == senha && u.profile_type == 1) {
                $("#entirecontent").load('../pages/adm_dashboard_index.html');
                not_found = 0;
                break;
            }
        }
        if (not_found == 1) {
            alert("Usuário e/ou senha não encontrados");
        }
    });
}