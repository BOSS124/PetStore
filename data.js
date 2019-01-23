const fs = require('fs');
const NodeCouchDb = require('node-couchdb');

const dbInfo = JSON.parse(
    fs.readFileSync(__dirname + '/db.json', {
        encoding: "utf8",
        flag: "r"
    })
);

const couchdb = new NodeCouchDb(dbInfo);

exports.addProduct = (prodInfo, successCallback, errorCallback) => {
    couchdb.uniqid().then(
        (id) => {
            couchdb.insert(
                'products',
                {
                    _id: id[0],
                    ...prodInfo
                }
            ).then(
                response => {
                    if(successCallback) successCallback();
                },
                err => {
                    if(errorCallback) errorCallback(new Error('Não foi possível adicionar o produto'));
                }
            );
        }
    );
};

exports.getAllProducts = (successCallback, errorCallback) => {
    couchdb.get(
        'products',
        '_design/query/_view/queryById',
        {}
    ).then(
        (result) => {
            let productList = [];
            for(let i = 0, len = result.data.rows.length; i < len; i++) {
                productList.push(result.data.rows[i].value);
            }
            if(successCallback) successCallback(productList);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível obter a lista de produtos'));
        }
    );
};

exports.getProductById = (id, successCallback, errorCallback) => {
    couchdb.get(
        'products',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        result => {
            if(result.data.rows[0] && successCallback) successCallback(result.data.rows[0].value);
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o produto'));
        }
    );
};

exports.updateProduct = (prod, successCallback, errorCallback) => {
    const error = err => {
        if(errorCallback) errorCallback(new Error('Não foi possível atualizar as informações do produto'));
    };

    couchdb.get(
        'products',
        '_design/query/_view/queryById',
        {key: Number(prod.id)}
    ).then(
        (data) => {
            couchdb.update(
                'products',
                {
                    _id: data.data.rows[0].value._id,
                    _rev: data.data.rows[0].value._rev,
                    ...prod
                }
            ).then(
                result => {
                    if(successCallback) successCallback();
                },
                error
            );
        },
        error
    );
};

exports.deleteProduct = (id, successCallback, errorCallback) => {
    couchdb.get(
        'products',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        data => {
            couchdb.del(
                'products',
                data.data.rows[0].value._id,
                data.data.rows[0].value._rev
            ).then(successCallback, errorCallback);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível deletar o produto'));
        }
    );
};

exports.addAnimal = (animalInfo, successCallback, errorCallback) => {
    couchdb.uniqid().then(
        (id) => {
            couchdb.insert(
                'animals',
                {
                    _id: id[0],
                    ...animalInfo
                }
            ).then(
                response => {
                    if(successCallback) successCallback();
                },
                err => {
                    if(errorCallback) errorCallback(new Error('Não foi possível adicionar o animal'));
                }
            );
        }
    );
};

exports.getAllAnimals = (successCallback, errorCallback) => {
    couchdb.get(
        'animals',
        '_design/query/_view/queryById',
        {}
    ).then(
        (result) => {
            let animalList = [];
            for(let i = 0, len = result.data.rows.length; i < len; i++) {
                animalList.push(result.data.rows[i].value);
            }
            if(successCallback) successCallback(animalList);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível obter a lista de animais'));
        }
    );
};

exports.getAnimalById = (id, successCallback, errorCallback) => {
    couchdb.get(
        'animals',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) successCallback(result.data.rows[0].value);
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o animal'));
        }
    );
};

exports.getAnimalByOwnerID = (ownerID, successCallback, errorCallback) => {
    couchdb.get(
        'animals',
        '_design/query/_view/queryByOwnerID',
        {key: Number(ownerID)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) {
                let animals = [];
                for(let i = 0, len = result.data.rows.length; i < len; i++) {
                    animals.push(result.data.rows[i].value);
                }
                successCallback(animals);
            }
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o animal'));
        }
    );
};

exports.updateAnimal = (animal, successCallback, errorCallback) => {
    const error = err => {
        if(errorCallback) errorCallback(new Error('Não foi possível atualizar as informações do animal'));
    };

    couchdb.get(
        'animals',
        '_design/query/_view/queryById',
        {key: Number(animal.id)}
    ).then(
        (data) => {
            couchdb.update(
                'animals',
                {
                    _id: data.data.rows[0].value._id,
                    _rev: data.data.rows[0].value._rev,
                    ...animal
                }
            ).then(
                result => {
                    if(successCallback) successCallback();
                },
                error
            );
        },
        error
    );
};

exports.deleteAnimal = (id, successCallback, errorCallback) => {
    couchdb.get(
        'animals',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        data => {
            couchdb.del(
                'animals',
                data.data.rows[0].value._id,
                data.data.rows[0].value._rev
            ).then(successCallback, errorCallback);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível deletar o animal'));
        }
    );
};

exports.addUser = (userInfo, successCallback, errorCallback) => {
    couchdb.uniqid().then(
        (id) => {
            couchdb.insert(
                'users',
                {
                    _id: id[0],
                    ...userInfo
                }
            ).then(
                response => {
                    if(successCallback) successCallback();
                },
                err => {
                    if(errorCallback) errorCallback(new Error('Não foi possível adicionar o usuário'));
                }
            );
        }
    );
};

exports.getAllUsers = (successCallback, errorCallback) => {
    couchdb.get(
        'users',
        '_design/query/_view/queryById',
        {}
    ).then(
        (result) => {
            let userList = [];
            for(let i = 0, len = result.data.rows.length; i < len; i++) {
                userList.push(result.data.rows[i].value);
            }
            if(successCallback) successCallback(userList);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível obter a lista de usuários'));
        }
    );
};

exports.getUserById = (id, successCallback, errorCallback) => {
    couchdb.get(
        'users',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) successCallback(result.data.rows[0].value);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o usuário'));
        }
    );
};

exports.getUserByEmail = (email, successCallback, errorCallback) => {
    couchdb.get(
        'users',
        '_design/query/_view/queryByEmail',
        {key: email}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) successCallback(result.data.rows[0].value);
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o usuário'));
        }
    );
};

exports.updateUser = (user, successCallback, errorCallback) => {
    const error = err => {
        if(errorCallback) errorCallback(err);
    };

    couchdb.get(
        'users',
        '_design/query/_view/queryById',
        {key: Number(user.id)}
    ).then(
        (data) => {
            couchdb.update(
                'users',
                
                {
                    _id: data.data.rows[0].value._id,
                    _rev: data.data.rows[0].value._rev,
                    ...user
                }
            ).then(
                result => {
                    if(successCallback) successCallback();
                },
                error
            );
        },
        error
    );
};

exports.deleteUser = (id, successCallback, errorCallback) => {
    couchdb.get(
        'users',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        data => {
            couchdb.del(
                'users',
                data.data.rows[0].value._id,
                data.data.rows[0].value._rev
            ).then(successCallback, errorCallback);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível deletar o usuário'));
        }
    );
};

exports.addSchedule = (scheduleInfo, successCallback, errorCallback) => {
    couchdb.uniqid().then(
        (id) => {
            couchdb.insert(
                'schedules',
                {
                    _id: id[0],
                    ...scheduleInfo
                }
            ).then(
                response => {
                    if(successCallback) successCallback();
                },
                err => {
                    if(errorCallback) errorCallback(new Error('Não foi possível adicionar o agendamento'));
                }
            );
        }
    );
};

exports.getAllSchedules = (successCallback, errorCallback) => {
    couchdb.get(
        'schedules',
        '_design/query/_view/queryById',
        {}
    ).then(
        (result) => {
            let scheduleList = [];
            for(let i = 0, len = result.data.rows.length; i < len; i++) {
                scheduleList.push(result.data.rows[i].value);
            }
            if(successCallback) successCallback(scheduleList);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível obter a lista de agendamentos'));
        }
    );
};

exports.getScheduleById = (id, successCallback, errorCallback) => {
    couchdb.get(
        'schedules',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) successCallback(result.data.rows[0].value);
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o agendamento'));
        }
    );
};

exports.getScheduleByOwnerID = (ownerID, successCallback, errorCallback) => {
    couchdb.get(
        'schedules',
        '_design/query/_view/queryByOwnerID',
        {key: Number(ownerID)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) {
                let schedule = [];
                for(let i = 0, len = result.data.rows.length; i < len; i++) {
                    schedule.push(result.data.rows[i].value);
                }
                successCallback(schedule);
            }
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar os agendamentos'));
        }
    );
};

exports.updateSchedule = (schedule, successCallback, errorCallback) => {
    const error = err => {
        if(errorCallback) errorCallback(new Error('Não foi possível atualizar as informações do agendamento'));
    };

    couchdb.get(
        'schedules',
        '_design/query/_view/queryById',
        {key: Number(schedule.id)}
    ).then(
        (data) => {
            couchdb.update(
                'schedules',
                {
                    _id: data.data.rows[0].value._id,
                    _rev: data.data.rows[0].value._rev,
                    ...schedule
                }
            ).then(
                result => {
                    if(successCallback) successCallback();
                },
                error
            );
        },
        error
    );
};

exports.deleteSchedule = (id, successCallback, errorCallback) => {
    couchdb.get(
        'schedules',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        data => {
            couchdb.del(
                'schedules',
                data.data.rows[0].value._id,
                data.data.rows[0].value._rev
            ).then(successCallback, errorCallback);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível deletar o agendamento'));
        }
    );
};

exports.addService = (serviceInfo, successCallback, errorCallback) => {
    couchdb.uniqid().then(
        (id) => {
            couchdb.insert(
                'services',
                {
                    _id: id[0],
                    ...serviceInfo
                }
            ).then(
                response => {
                    if(successCallback) successCallback();
                },
                err => {
                    if(errorCallback) errorCallback(new Error('Não foi possível adicionar o serviço'));
                }
            );
        }
    );
};

exports.getAllServices = (successCallback, errorCallback) => {
    couchdb.get(
        'services',
        '_design/query/_view/queryById',
        {}
    ).then(
        (result) => {
            let serviceList = [];
            for(let i = 0, len = result.data.rows.length; i < len; i++) {
                serviceList.push(result.data.rows[i].value);
            }
            if(successCallback) successCallback(serviceList);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível obter a lista de serviços'));
        }
    );
};

exports.getServiceById = (id, successCallback, errorCallback) => {
    couchdb.get(
        'services',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        result => {
            if(result.data.rows.length > 0 && successCallback) successCallback(result.data.rows[0].value);
            else successCallback(null);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível encontrar o serviço'));
        }
    );
};

exports.updateService = (service, successCallback, errorCallback) => {
    const error = err => {
        if(errorCallback) errorCallback(new Error('Não foi possível atualizar as informações do serviço'));
    };

    couchdb.get(
        'schedules',
        '_design/query/_view/queryById',
        {key: Number(schedule.id)}
    ).then(
        (data) => {
            couchdb.update(
                'services',
                {
                    _id: data.data.rows[0].value._id,
                    _rev: data.data.rows[0].value._rev,
                    ...schedule
                }
            ).then(
                result => {
                    if(successCallback) successCallback();
                },
                error
            );
        },
        error
    );
};

exports.deleteService = (id, successCallback, errorCallback) => {
    couchdb.get(
        'services',
        '_design/query/_view/queryById',
        {key: Number(id)}
    ).then(
        data => {
            couchdb.del(
                'services',
                data.data.rows[0].value._id,
                data.data.rows[0].value._rev
            ).then(successCallback, errorCallback);
        },
        err => {
            if(errorCallback) errorCallback(new Error('Não foi possível deletar o serviço'));
        }
    );
};