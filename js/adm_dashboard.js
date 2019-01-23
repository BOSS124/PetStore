var stockFilter = {
	category: null,
	pet: null
};

var productList = [];

function loadStock() {
	var container = $("#stock")[0];
	
	$.get('/productlist', function(data, status) {
		$("#stock_items").empty();
		productList = [];

		for(let i in data) {
			let prod = data[i];
			let select = true;

			if(stockFilter.category !== null && prod.category !== stockFilter.category)
				select = false;

			if(stockFilter.pet !== null && prod.target !== stockFilter.pet)
				select = false;

			if(select) {
				productList.push(prod);
				$.get('/' + prod.imgFile, function(data, status) {
					$("#stock_items").append(
						'<div class="col-sm-6 col-md-4 col-lg-3">\
								<figure class="thumbnail">\
									<img class="product img-thumbnail" align="center" src="/' + prod.imgFile + '" alt="">\
									<figcaption class="caption">\
										 <p class="product_item">' + prod.name + '</br>ID: ' + prod.id + '<br>\
										 R$ ' + prod.price.toFixed(2).replace(".", ",") + '</br>\
										 Qtd: ' + prod.amount + '</p></br>\
										<button role="button" class="btn btn-primary btn-buy" onclick="loadProductModal(' + prod.id + ');">Editar</button>\
									</figcaption>\
								</figure>\
						</div>'
					);
				});
			}
		}
	});
}

function loadProductModal(productId) {
		let product;
		for(let i in productList) {
			if(productList[i].id == productId) {
				product = productList[i];
				break;
			}
		}
		let modal = $("#stock_item_modal");

		$.get('/' + product.imgFile, function(data, status) {
			$("#modal_prodimg").attr("src", "/" + product.imgFile);
			$("#modal_prodid").val(product.id);
			$("#modal_prodname").val(product.name);

			switch(product.category) {
				case "food":
				$("#modal_prodcategory").prop("selectedIndex", 0);
				break;

				case "supplement":
				$("#modal_prodcategory").prop("selectedIndex", 1);
				break;

				case "toy":
				$("#modal_prodcategory").prop("selectedIndex", 2);
				break;

				case "accessory":
				$("#modal_prodcategory").prop("selectedIndex", 3);
				break;

				case "hygiene":
				$("#modal_prodcategory").prop("selectedIndex", 4);
				break;

				default:
			}

			switch(product.target) {
				case "dogs":
				$("#modal_prodtarget").prop("selectedIndex", 0);
				break;

				case "cats":
				$("#modal_prodtarget").prop("selectedIndex", 1);
				break;

				case "birds":
				$("#modal_prodtarget").prop("selectedIndex", 2);
				break;

				case "fishes":
				$("#modal_prodtarget").prop("selectedIndex", 3);
				break;
			}

			$("#modal_prodprice").val(product.price);
			$("#modal_prodamount").val(product.amount);

			$("#modal-btn-cancel").unbind().click(function(event) {
				modal.modal("toggle");
			});

			modal.modal();
		});
}

function setStockFiltersCategory(category) {
	stockFilter.category = category;
}

function setStockFiltersPet(pet) {
	stockFilter.pet = pet;
}

function resetStockFilters() {
	stockFilter.category= null;
	stockFilter.pet = null;
}

function search() {
	var searchString = $("#stock_search_input").val();
        $("#stock_items").empty();
        let selectedProds = [];

		for(var i in productList) {
			let prod = productList[i];

			if(prod.name.includes(searchString) || (parseInt(searchString) === prod.id)) {
                selectedProds.push(prod);
				$("#stock_items").append(
					'<div class="col-sm-6 col-md-4 col-lg-3">\
							<figure class="thumbnail">\
							    <img class="product img-thumbnail" align="center" src="/' + prod.imgFile + '" alt="">\
								<figcaption class="caption">\
						 			<p class="product_item">' + prod.name + '</br>ID: ' + prod.id + '<br>\
						 			R$ ' + prod.price.toFixed(2) + '</br>\
						 			Qtd: ' + prod.amount + '</p></br>\
					    			<button role="button" class="btn btn-primary btn-buy" onclick="loadProductModal(' + prod.id + ');">Editar</button>\
								</figcaption>\
							</figure>\
					</div>'
				);
			}
        }
        productList = selectedProds;
}

function load_adm_services() {
	$("#admcontent").load("../pages/adm_servicos.html");
}

function load_adm_cad() {
	$("#admcontent").load("../pages/cadastro_adm.html");
}

function load_adm_stock() {
	$("#admcontent").load("../pages/estoque_adm.html");
	loadStock();
}

function load_adm_profile() {
    $("#admcontent").load("../pages/perfil_adm.html");
}

function load_adm_users() {
	$("#admcontent").load("../pages/adm_usuarios.html");
}

function load_adm_profile_edit() {
	$("#admcontent").load("../pages/perfil_adm_edit.html");
}

function load_adm_cad1() {
	$("#admcontent").load("../pages/cadastro_adm1.html");
}

function load_adm_cad2() {
	$("#admcontent").load("../pages/cadastro_adm2.html");
}

function load_adm_cad3() {
	$("#admcontent").load("../pages/cadastro_adm3.html");
}

function load_adm_cad4() {
	$("#admcontent").load("../pages/cadastro_adm4.html");
}

function load_adm_cad5() {
    $("#admcontent").load("../pages/cadastro_adm5.html");
}

function load_adm_cad6() {
	$("#admcontent").load("../pages/cadastro_adm6.html");
}

function reload_index(){
    $(document).ready(function(){
        $("body").load("../index.html");
    });
}

function add_client_user() {
    var name = $("#cad_nome").val();
    var email = $("#cad_email").val();
    var tphone = $("#cad_telefone").val();
    var cphone = $("#cad_celular").val();
    var birthdate = $("#cad_nascimento").val();
    var genre = $("#cad_sexo").val();
    var profiletype = 2;
    var cpf = $("#cad_cpf").val();
    var cep = $("#cad_cep").val();
    var address = $("#cad_endereco").val();
    var number = $("#cad_numero").val();
    var comp = $("#cad_complemento").val();
    var password = $("#cad_senha").val();
    var neighborhood = $("#cad_bairro").val();
    var complement = $("#cad_complemento").val();
    var newprod = {};

    getUserCount(function(count) {
        newprod.id = count;
        newprod.name = name;
        newprod.email = email;
        newprod.genre = genre;
        newprod.cpf = cpf;
        newprod.birth_date = birthdate;
        newprod.address = address;
        newprod.number = number;
        newprod.complement = complement;
        newprod.neighborhood = neighborhood;
        newprod.cep = cep;
        newprod.telephone = tphone; 
        newprod.cellphone = cphone;
        newprod.email = email;
        newprod.password = password;
        newprod.profile_type = profiletype;
        createOrUpdateUser(newprod, function() {
            alert("Cadastro realizado com sucesso!");
            reload_index();
        });
    });
}

function add_adm_user() {
    var name = $("#cad_nome").val();
    var email = $("#cad_email").val();
    var tphone = $("#cad_telefone").val();
    var cphone = $("#cad_celular").val();
    var birthdate = $("#cad_nascimento").val();
    var genre = $("#cad_sexo").val();
    var profiletype = 1;
    var cpf = $("#cad_cpf").val();
    var cep = $("#cad_cep").val();
    var address = $("#cad_endereco").val();
    var number = $("#cad_numero").val();
    var comp = $("#cad_complemento").val();
    var password = $("#cad_senha").val();
    var neighborhood = $("#cad_bairro").val();
    var complement = $("#cad_complemento").val();
    var newprod = {};

    getUserCount(function(count) {
        newprod.id = count;
        newprod.name = name;
        newprod.email = email;
        newprod.genre = genre;
        newprod.cpf = cpf;
        newprod.birth_date = birthdate;
        newprod.address = address;
        newprod.number = number;
        newprod.complement = complement;
        newprod.neighborhood = neighborhood;
        newprod.cep = cep;
        newprod.telephone = tphone; 
        newprod.cellphone = cphone;
        newprod.email = email;
        newprod.password = password;
        newprod.profile_type = profiletype;
        createOrUpdateUser(newprod, function() {
            alert("Cadastro realizado com sucesso!");
            reload_index();
        });
    });
}


function add_adm_schedule() {
    var attendance_type = $("#nome").val();
    var name_pet = $("#animal").val();
    var attendance_date = $("#data_consulta").val();
    var hours = $("#hora_consulta").val();
    var newschedule = {};
    getScheduleCount(function(count) {
        newschedule.id = count;
        newschedule.id_owner = null;
        newschedule.name_pet = name_pet;
        newschedule.attendance_type = attendance_type;
        newschedule.attendance_date = attendance_date;
        newschedule.hours = hours;
        newschedule.id_pet = null;
        createOrUpdateSchedule(newschedule, function() {
            alert("Cadastro realizado com sucesso!");
        });
    });
}


function update_adm_user() {
    var name = $("#nome").val();
    var tphone = $("#telefone").val();
    var cphone = $("#celular").val();
    var birthdate = $("#data_nascimento").val();
    var cpf = $("#cpf").val();
    var cep = $("#cep").val();
    var address = $("#endereco").val();
    var number = $("#numero").val();
    var comp = $("#complemento").val();
    var neighborhood = $("#ngbd").val();
    var complement = $("#complemento").val();
    var user = {};

    user.id = 1;
    user.email = "luisa@gmail.com";
    user.genre = "f";
    user.profile_pic = "perfil_luisa.jpeg";
    user.password = "dinheiro";
    user.profile_type = 1;
    user.name = name;
    user.cpf = cpf;
    user.birth_date = birthdate;
    user.address = address;
    user.number = number;
    user.complement = complement;
    user.neighborhood = neighborhood;
    user.cep = cep;
    user.telephone = tphone; 
    user.cellphone = cphone;
    createOrUpdateUser(user, function() {
        alert("Cadastro atualizado com sucesso!");
    });   
}

function delete_schedule() {
	alert("O serviço será cancelado em até 24 horas!");
}