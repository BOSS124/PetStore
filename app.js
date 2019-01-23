const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const data = require('./data.js');

const cfg = JSON.parse(
    fs.readFileSync(__dirname + '/config.json', {
        encoding: "utf8",
        flag: "r"
    })
);

const app = express();

app.use(express.static(__dirname));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(formData.parse(
    {
        uploadDir: "./uploads/"
    }
));

app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use(session({
    secret: 'ljpetstore',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        secure: false,
        httpOnly: true
    }
}));

let lastProductId = -1;
let lastAnimalId = -1;
let lastScheduleId = -1;
let lastUserId = -1;
let lastServiceId = -1;

app.get('/productlist', (req, res) => {
    data.getAllProducts((productList) => {
        res.status = 200;
        res.send(productList);
    }, err => {
        res.status = 500;
        res.send(err);
    });
});

app.post('/addproduct', (req, res) => {
    if(req.session.user.profile_type === 1) {
        let product = {};
        product.id = ++lastProductId;
        product.name = req.body.name;
        product.target = req.body.target;
        product.category = req.body.category;
        product.amount = Number(req.body.amount);
        product.price = Number(req.body.price.replace(",", "."));
        product.imgFile = req.body.image.path;

        data.addProduct(
            product,
            () => {
                res.status = 200;
                res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status = 500;
                res.send(err);
            }
        );
    }
    else {
        res.status = 500;
        res.send(new Error('Você precisa estar logado como administrador para adicionar produtos'));
    }
});

app.post('/updateproduct', (req, res) => {
    if(req.session.user.profile_type === 1) {
        let product = {};
        product.id = Number(req.body.id);
        product.name = req.body.name;
        product.target = req.body.target;
        product.category = req.body.category;
        product.amount = Number(req.body.amount);
        product.price = Number(req.body.price.replace(",", "."));

        if(!req.body.image) {
            data.getProductById(
                product.id,
                prod => {
                    product.imgFile = prod.imgFile;
                    data.updateProduct(
                        product,
                        () => {
                            res.status = 200;
                            res.redirect('/adm_dashboard_index');
                        },
                        err => {
                            res.status(500);
                            res.send(err);
                        }
                    );
                },
                err => {
                    res.status(500);
                    res.send(err);
                }
            );
        }
        else {
            product.imgFile = req.body.image.path;

            data.updateProduct(
                product,
                () => {
                    res.status = 200;
                    res.redirect('/adm_dashboard_index');
                },
                err => {
                    res.status(500);
                    res.send(err);
                }
            );
        }
    }
    else {
        res.status = 500;
        res.send(new Error('Você precisa estar logado como administrador para adicionar produtos'));
    }
});

app.get('/adm_dashboard_index', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
        res.render(
            'adm_dashboard_index',
            {
                userName: req.session.user.name
            },
            (err, html) => {
                res.send(html);
            }
        );
    }
    else {
        res.redirect('/');
    }
});

app.get('/dashboard_cliente', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 2) {
        res.render(
            'dashboard_cliente',
            {
                userName: req.session.user.name
            },
            (err, html) => {
                res.send(html);
            }
        );
    }
    else {
        res.redirect('/');
    }
});


//Login and Logout handling ...

app.post('/login', (req, res) => {
    data.getUserByEmail(
        req.body.email,
        user => {
            if(user !== null) {
                if(user.password === req.body.password){

                    req.session.user = {...user};

                    if(user.profile_type === 1) { //admin user
                        res.redirect('/adm_dashboard_index');
                    }
                    else { //normal user
                        res.redirect('/dashboard_cliente');
                    }
                }
                else{
                    console.log("senha incorreta");
                    res.redirect('index.html');
                }
            }
            else {
                console.log("usuario nao encontrado");
                res.redirect('index.html', 500);
            }
        },
        err => {
            res.redirect('index.html');
        }
    );
});

app.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect('/');
});

app.post('/addtocart', (req, res) => {
    if(req.body.productId || req.body.animalId) {

        let pID = Number(req.body.productId);
        let petID = Number(req.body.animalId);
        

        if(req.session.cart) {
            if(!isNaN(pID)) {
                let added = false;
                for(let i = 0, len = req.session.cart.length; i < len; i++) {
                    if(!isNaN(pID)) {
                        if(typeof req.session.cart[i].id !== 'undefined' && req.session.cart[i].id === pID) {
                            req.session.cart[i].amount++;
                            added = true;
                            break;
                            
                        }
                    }
                }
                if(!added) {
                    req.session.cart.push(
                        {
                            id: pID,
                            amount: 1
                        }
                    );
                }
            }
            else if(!isNaN(petID)) {
                req.session.cart.push(
                    {
                        pid: petID
                    }
                );
            }
        }
        else {
            req.session.cart = [];
            if(!isNaN(pID)) {
                req.session.cart.push(
                    {
                        id: pID,
                        amount: 1
                    }
                );
            }
            if(!isNaN(petID)) {
                req.session.cart.push(
                    {
                        pid: petID
                    }
                );
            }
        }
       res.redirect("carrinho.html");
       // res.send("O item foi adicionado ao carrinho com sucesso!");

    }
    else {
        res.status(500).send("Erro ao adicionar item ao carrinho!");
    }
});

app.post('/removefromcart', (req, res) => {
    if(req.body.productId) {
        let pID = Number(req.body.productId);

        if(req.session.cart) {
            for(let i = 0, len = req.session.cart.length; i < len; i++) {
                if(req.session.cart[i].id === pID) {
                    req.session.cart[i].amount = 0;
                    break;
                }
            }
        }
        res.send("O item foi removido do carrinho com sucesso!");
    }
    else {
        res.status(500).send("Erro ao remover item ao carrinho!");
    }
});

app.post('/emptycart', (req, res) => {
    if(req.session.cart) req.session.cart = [];
    res.send("Seu carrinho está vazio");
});

app.get('/cartitens', (req, res) => {
    let cartItens = [];
    if(req.session.cart && req.session.cart.length) {
        for(let i = 0, len = req.session.cart.length; i < len; i++) {
            if(!isNaN(req.session.cart[i].id)) {
                data.getProductById(
                    Number(req.session.cart[i].id),
                    prod => {
                        cartItens.push(
                            {
                                imgFile: prod.imgFile,
                                name: prod.name,
                                amount: req.session.cart[i].amount,
                                price: prod.price
                            }
                        );
                        if(cartItens.length === req.session.cart.length) res.send(cartItens);

                    },
                    err => {
                        res.sendStatus(500);
                    }
                );
            }
            else if(!isNaN(req.session.cart[i].pid)) {
                data.getAnimalById(
                    Number(req.session.cart[i].pid),
                    pet => {
                        cartItens.push(
                            {
                                imgFile: pet.imgFile,
                                name: pet.name,
                                amount: 1,
                                price: pet.price
                            }
                        );
                        if(cartItens.length === req.session.cart.length) res.send(cartItens);
                    },
                    err => {
                        res.sendStatus(500);
                    }
                );
            }
        }
    }
});

app.post('/registeruser', (req, res) => {
    data.getUserByEmail(
        req.body.email,
        user => {
            if(user === null) {
                data.addUser(
                    {
                        id: ++lastUserId,
                        name: req.body.name,
                        genre: req.body.genre,
                        cpf: req.body.cpf,
                        profile_pic: req.body.image.path,
                        birth_date: req.body.birth,
                        address: req.body.address,
                        number: Number(req.body.num),
                        complement: req.body.complement,
                        neighborhood: req.body.neighborhood,
                        cep: req.body.cep,
                        telephone: req.body.tel,
                        cellphone: req.body.cel,
                        email: req.body.email,
                        password: req.body.password,
                        profile_type: Number(req.body.profile_type)
                    },
                    () => {
                        if(req.session.user) {
                            res.redirect('/adm_dashboard_index');
                        } else {
                            res.redirect('/');
                        }
                    },
                    err => {
                        res.status(500).send(err);
                    }
                );
            }
            else {
                res.status(500).send("Email já cadastrado");
            }
        },
        err => {
            res.status(500).send(err);
        }
    );
    
});

app.get('/userprofile', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 2) {
        data.getUserById(
            req.session.user.id,
            user => {
                res.send(user);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você não está logado!");
    }
});

app.get('/admprofile', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
        res.send(req.session.user);
        return;
        data.getUserById(
            req.session.user.id,
            user => {
                res.send(user);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você não está logado!");
    }
});

app.post('/updateuserprofile', (req,res) => {
    if(req.session.user && req.session.user.profile_type === 2) {
        let userInfo = {...req.session.user};

        userInfo.name = req.body.name;
        userInfo.cpf = req.body.cpf;
        userInfo.birth_date = req.body.birth;
        userInfo.address = req.body.address;
        userInfo.number = Number(req.body.num);
        userInfo.complement = req.body.complement;
        userInfo.neighborhood = req.body.neighborhood;
        userInfo.cep = req.body.cep;
        userInfo.telephone = req.body.tel;
        userInfo.cellphone = req.body.cel;
        if(req.body.image) userInfo.profile_pic = req.body.image.path;
        delete userInfo._id;
        delete userInfo._rev;

        data.updateUser(
            userInfo,
            () => {
                req.session.user = {...userInfo};
                res.redirect('/dashboard_cliente');
            },
            err => {
                console.log(err);
                res.sendStatus(500);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para alterar seu perfil");
    }
});

app.post('/updateadmprofile', (req,res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
        let userInfo = {...req.session.user};

        userInfo.name = req.body.name;
        userInfo.cpf = req.body.cpf;
        userInfo.birth_date = req.body.birth;
        userInfo.address = req.body.address;
        userInfo.number = Number(req.body.num);
        userInfo.complement = req.body.complement;
        userInfo.neighborhood = req.body.neighborhood;
        userInfo.cep = req.body.cep;
        userInfo.telephone = req.body.tel;
        userInfo.cellphone = req.body.cel;
        if(req.body.image) userInfo.profile_pic = req.body.image.path;
        delete userInfo._id;
        delete userInfo._rev;

        data.updateUser(
            userInfo,
            () => {
                req.session.user = {...userInfo};
                res.redirect('/adm_dashboard_index');
            },
            err => {
                console.log(err);
                res.sendStatus(500);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para alterar seu perfil");
    }
});

app.post('/registerpet', (req, res) => {
    if(req.session.user) {
        let pet = {};
        pet.id = ++lastAnimalId;
        if(req.body.name) {
            pet.name = req.body.name;
        }
        else {
            pet.name = null;
        }
        if(req.session.user.profile_type === 2) {
            pet.ownerID = req.session.user.id;
            pet.price = 0;
        }
        else  {
            pet.ownerID = null;
            pet.price = Number(req.body.price);
        }
        pet.breed = req.body.breed;
        pet.category = req.body.category;
        pet.birth = req.body.birth;
        pet.genre = req.body.genre;
        pet.imgFile = req.body.image.path;
        
        data.addAnimal(
            pet,
            () => {
                if(req.session.user.profile_type === 2)
                    res.redirect('/dashboard_cliente');
                else
                    res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para cadastrar um pet");
    }
});

app.get('/getpetlist/:id([0-9]+)', (req, res) => {
    if(req.session.user) {
        data.getAnimalById(
            req.params.id,
            animal => {
                res.send(animal);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para ver a lista de pets cadastrados");
    }
});

app.get('/sellingpets', (req, res) => {
    let sellingPets = [];
    data.getAllAnimals(
        list => {
            for(let i = 0, len = list.length; i < len; i++) {
                if(list[i].ownerID === null)
                    sellingPets.push(list[i]);
            }
            res.send(sellingPets);
        },
        err => {
            res.status(500).send(err);
        }
    );
});

app.get('/clientpetlist', (req, res) => {
    if(req.session.user) {
        data.getAnimalByOwnerID(
            req.session.user.id,
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para ver a lista de pets");
    }
});

app.get('/clientpetlist/:id([0-9]+)', (req, res) => {
    if(req.session.user) {
        data.getAnimalByOwnerID(
            req.params.id,
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para ver a lista de pets");
    }
});

app.post('/registerschedule', (req, res) => {
    if(req.session.user) {
         data.getAnimalById(
            Number(req.body.id_animal),
            animal => {
                data.getServiceById(
                    Number(req.body.id_service),
                    service => {
                        let schedule = {}
                        schedule.id = ++lastScheduleId;
                        
                        schedule.id_owner = req.session.user.id;
                        schedule.owner_name = req.session.user.name;

                        schedule.id_pet = animal.id;
                        schedule.name_pet = animal.name;
                        schedule.image_pet = animal.imgFile;
                        
                        schedule.id_service = service.id;
                        schedule.name_service = service.name;
                        schedule.image_service = service.service_image;
                        schedule.price = service.price;
                        
                        schedule.attendance_date = req.body.attendance_date;
                        schedule.hours = req.body.hours;
                        data.addSchedule(
                            schedule,
                            () => {
                                res.redirect('/dashboard_cliente');
                            },
                            err => {
                                req.status(500).send(err);
                            }
                        );
                    },
                    err => {
                        req.status(500).send(err);
                    }
                );
            },
            err => {
                req.status(500).send(err);
            }            
        );
     }

    else {
        req.status(500).send("Você precisa estar logado para agendar serviços");
    }

});

app.post('/registerscheduleadm', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
         data.getAnimalById(
            Number(req.body.ida_animal),
            animal => {
                data.getServiceById(
                    Number(req.body.ida_service),
                    service => {
                        data.getUserById(
                            Number(req.body.ida_owner),
                            user => {
                                let schedule = {}
                                schedule.id = ++lastScheduleId;
                                
                                schedule.id_owner = user.id;
                                schedule.owner_name = user.name;
                                schedule.id_pet = animal.id;
                                schedule.name_pet = animal.name;
                                schedule.image_pet = animal.imgFile;
                                
                                schedule.id_service = service.id;
                                schedule.name_service = service.name;
                                schedule.image_service = service.service_image;
                                schedule.price = service.price;
                                
                                schedule.attendance_date = req.body.attendance_date;
                                schedule.hours = req.body.hours;
                                data.addSchedule(
                                    schedule,
                                    () => {
                                        res.redirect('/adm_dashboard_index');
                                    },
                                    err => {
                                        req.status(500).send(err);
                                    }
                                );
                            },
                            err => {
                                req.status(500).send(err);
                            }
                        );
                    },
                    err => {
                        req.status(500).send(err);
                    }
                );
            },
            err => {
                req.status(500).send(err);
            }            
        );
     }

    else {
        req.status(500).send("Você precisa estar logado para agendar serviços");
    }

});

app.post('/deleteschedule', (req, res) => {
    if(req.session.user) {
        const scheduleId = Number(req.body.id);
        data.deleteSchedule(
            scheduleId,
            () => {
                res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para deletar serviços");
    }
});

app.post('/deleteuser', (req, res) => {
    if(req.session.user) {
        const userId = Number(req.body.id);
        data.deleteUser(
            userId,
            () => {
                res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para deletar um usuário");
    }
});


app.get('/clientschedulelist', (req, res) => {
    if(req.session.user) {
        data.getScheduleByOwnerID(
            req.session.user.id,
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para ver a lista de pets");
    }
});

app.get('/clientsanimalschedulelist', (req, res) => {
    if(req.session.user) {
        data.getScheduleByOwnerID(
            req.session.user.id,
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado para ver a lista de pets");
    }
});


app.get('/allschedulelist', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
        data.getAllSchedules(
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para ver a lista de agendamentos");
    }
});

app.post('/registerservice', (req, res) => {
    if(req.session.user) {
        let service = {};
        service.id = ++lastServiceId;
        service.name = req.body.name;
        service.description = req.body.description;
        service.price = req.body.price;
        service.service_image = req.body.image.path;
        data.addService(
            service,
            () => {
                res.redirect('/adm_dashboard_index');
            },
            err => {
                req.status(500).send(err);
            }
        );
    }
    else {
        req.status(500).send("Você precisa estar logado para agendar serviços");
    }
});

app.post('/deleteservice', (req, res) => {
    if(req.session.user) {
        const serviceId = Number(req.body.id);
        data.deleteService(
            serviceId,
            () => {
                res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para deletar serviços");
    }
});

app.post('/deleteuser', (req, res) => {
    if(req.session.user) {
        const userId = Number(req.body.id);
        data.deleteUser(
            userId,
            () => {
                res.redirect('/adm_dashboard_index');
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para deletar um usuário");
    }
});

app.get('/allservicelist', (req, res) => {
    if(req.session.user) {
        data.getAllServices(
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para ver a lista de serviços");
    }
});

app.get('/alluserslist', (req, res) => {
    if(req.session.user && req.session.user.profile_type === 1) {
        data.getAllUsers(
            list => {
                res.send(list);
            },
            err => {
                res.status(500).send(err);
            }
        );
    }
    else {
        res.status(500).send("Você precisa estar logado como administrador para ver a lista de usuarios");
    }
});


const server = app.listen(cfg.server.port, () => {
        if(!fs.existsSync('./uploads/')) fs.mkdirSync('./uploads/');

        data.getAllUsers(
            list => {
                for(let i = 0, len = list.length; i < len; i++) {
                    if(list[i].id > lastUserId) lastUserId = list[i].id;
                }
            },
            err => {

            }
        );
        
        data.getAllProducts(
            list => {
                for(let i = 0, len = list.length; i < len; i++) {
                    if(list[i].id > lastProductId) lastProductId = list[i].id;
                }
            },
            err => {
            }
        );
        data.getAllAnimals(
            list => {
                for(let i = 0, len = list.length; i < len; i++) {
                    if(list[i].id > lastAnimalId) lastAnimalId = list[i].id;
                }
            },
            err => {
            }
        );
        data.getAllSchedules(
            list => {
                for(let i = 0, len = list.length; i < len; i++) {
                    if(list[i].id > lastScheduleId) lastScheduleId = list[i].id;
                }
            },
            err => {
            }
        );
        data.getAllServices(
            list => {
                for(let i = 0, len = list.length; i < len; i++) {
                    if(list[i].id > lastServiceId) lastServiceId = list[i].id;
                }
            },
            err => {
            }
        );
    }
);