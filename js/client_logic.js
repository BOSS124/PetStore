function toggle_scheduler() {
    var scheduler = document.getElementById("schedule");
    if (scheduler.style.display !== "block") {
        $.get('/allservicelist', function(data, status) {
            if(status === "success") {
                if(data.length === 0) {
                    alert('Você não possui serviços cadastrados. Para agendar é preciso ter pelo menos 1 tipo de serviço cadastrado!');
                }
                else {
                    for(let i in data) {
                        $('#service').append(
                            '<option value="' + String(data[i].id) + '">' + data[i].name + '</option>');
                    }
                    scheduler.style.display = "block";
                }
            }
            else {
                alert("Falha na comunicação com o servidor. Tente novamente mais tarde");
            }
        });
        $.get('/getpetlist', function(data, status) {
            if(status === "success") {
                if(data.length === 0) {
                    alert('Você não possui animais cadastrados. Para agendar é preciso ter pelo menos 1 animal cadastrado!');
                    load_register_animal();
                }
                else {
                    for(let i in data) {
                        $('#animal').append(
                            '<option value="' + String(data[i].id) + '">' + data[i].name + '</option>');
                    }
                    scheduler.style.display = "block";
                }
            }
            else {
                alert("Falha na comunicação com o servidor. Tente novamente mais tarde");
            }
        });
        
    } else {
        scheduler.style.display = "none";
    }
}