const databaseURL = "https://landing-760a9-default-rtdb.firebaseio.com/data.json";

// Función para enviar los datos al servidor
let sendData = () => {  
    // Obtén los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto

     // Obtener el valor del plan de suscripción
    const subscription = document.getElementById('form_subscription').value;
     data['subscription'] = subscription; // Añadir suscripción al objeto data
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json(); // Procesa la respuesta como JSON
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces');
        form.reset(); // Resetea el formulario
        // Recuperación de datos actualizada
        getData();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    });
}

// Función para obtener y mostrar los datos
let getData = async () => {  
    try {
        const response = await fetch(databaseURL, { method: 'GET' });
        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
            return;
        }

        const data = await response.json();
        
        if (data != null) {
            // 1. Contadores para planes
            let planInterest = {
                basic: 0,
                premium: 0,
                family: 0
            };

            // 2. Contador para interesados por día
            let countByDay = new Map();

            // Recorrer todos los datos para contar planes e interesados por día
            for (let key in data) {
                let { subscription, saved } = data[key];

                // Contar interesados por plan
                if (subscription) {
                    if (subscription === 'basic') {
                        planInterest.basic += 1;
                    } else if (subscription === 'premium') {
                        planInterest.premium += 1;
                    } else if (subscription === 'family') {
                        planInterest.family += 1;
                    }
                }

                // Contar interesados por día
                let date = saved.split(",")[0]; // Obtener solo la fecha (sin la hora)
                let count = countByDay.get(date) || 0;
                countByDay.set(date, count + 1); // Incrementar el contador por día
            }

            // 3. Mostrar los interesados por plan
            document.getElementById('basic-count').textContent = planInterest.basic;
            document.getElementById('premium-count').textContent = planInterest.premium;
            document.getElementById('family-count').textContent = planInterest.family;

            // 4. Mostrar los interesados por día en la tabla
            const subscribers = document.getElementById('subscribers'); // Asegúrate de que este elemento exista en el HTML
            if (subscribers) {
                subscribers.innerHTML = ''; // Limpiar la tabla antes de llenarla con nuevos datos

                let index = 1;
                for (let [date, count] of countByDay) {
                    let rowTemplate = `
                        <tr>
                            <th>${index}</th>
                            <td>${date}</td>
                            <td>${count}</td>
                        </tr>`;
                    subscribers.innerHTML += rowTemplate;
                    index++;
                }
            }
        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    }
};

// Función cuando el DOM está listo
let ready = () => {
    console.log('DOM está listo');
    // Recuperación de datos
    getData();
}

// Función cuando la página está completamente cargada
let loaded = (eventLoaded) => {
    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            emailElement.focus()
            return;
        }

        // Llamada a la función sendData()
        sendData();
    });
}

// Ejecutar cuando el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);
