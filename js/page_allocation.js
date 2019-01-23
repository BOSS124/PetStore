
function init() {
    $(document).ready(function(){
        $("#produtos").load("../pages/produtos_semlogin.html");
        $("#animais").load("../pages/animais_semlogin.html");
    }); 
}
function redirect_login() {
    $(document).ready(function(){
        $("#entirecontent").load("../pages/login.html");
    }); 
}

function redirect_signup() {
    $(document).ready(function(){
        $("#entirecontent").load("../pages/cadastro.html");
    }); 
}

function reload_index(){
    $(document).ready(function(){
        $("#entirecontent").load("../index.html #entirecontent", function() {
            init();
        });
    });
}

function reload_index_adm(){
    $(document).ready(function(){
        $("#entirecontent").load("../index.html #entirecontent", function() {
            $(document).ready(function(){
                $("#produtos").load("../pages/produtos_semlogin.html");
                $("#animais").load("../pages/animais_semlogin.html");
            }); 
        });
    });
}

function load_products_client() {
    $("#clientcontent").load("/pages/produtos_semlogin.html");
}

function load_pets_client() {
    $("#clientcontent").load("/pages/pets_cliente.html");
}

function load_animal_client(){
    $("#clientcontent").load("/pages/animais_cliente.html");
}

function load_register_animal(){
    $("#clientcontent").load("/pages/cadastro_animal_cliente.html");
}

function load_schedules(){
    $("#clientcontent").load("/pages/agendamentos_cliente.html");
}

function load_profile_client(){
    $("#clientcontent").load("./pages/perfil_cliente.html");
}

function load_profile_client_edit(){
    $(document).ready(function(){
        $("#clientcontent").load("../pages/perfil_cliente_edit.html");
    });
}

function open_cart() {
    $(document).ready(function(){
        $("#clientcontent").load("../pages/carrinho.html");
    });
}

function get_animal_details(id) {
    $(document).ready(function(){
        var def = parseInt(id);
        $("#clientcontent").load("../pages/animais_cliente_esp.html");
        localStorage.setItem("animal_id", def);
        
    });
}
