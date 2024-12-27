let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

class Turno {
    static id = turnos.length ? turnos[turnos.length - 1].id + 1 : 1;
    constructor(cliente, telefono, direccion, email, auto, kilometros, servicio, fecha, hora) {
        this.id = Turno.id++;
        this.cliente = cliente;
        this.telefono = telefono;
        this.direccion = direccion;
        this.email = email;
        this.auto = auto;
        this.kilometros = kilometros;
        this.servicio = servicio;
        this.fecha = fecha;
        this.hora = hora;
    }
}

// Función para registrar un turno
const registrarTurno = () => {
    const cliente = document.getElementById("cliente").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const email = document.getElementById("email").value.trim(); // Corregido
    const auto = document.getElementById("auto").value.trim();
    const kilometros = parseInt(document.getElementById("kilometros").value.trim());
    const servicio = document.getElementById("servicio").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const hora = document.getElementById("hora").value.trim();

    // Programación defensiva
    if (!cliente || !telefono || !direccion || !email || !auto || isNaN(kilometros) || !servicio || !fecha || !hora) {
        mostrarError("Error: Todos los campos son obligatorios y deben ser válidos.");
        return;
    }

    const nuevoTurno = new Turno(cliente, telefono, direccion, email, auto, kilometros, servicio, fecha, hora);
    turnos.push(nuevoTurno);

    // Guardar en localStorage
    localStorage.setItem("turnos", JSON.stringify(turnos));

    mostrarTurnos();
    document.getElementById("formTurno").reset();
};

const servicioMenu = document.getElementById("servicioMenu");
servicioMenu.addEventListener("click", (event) => {
    if (event.target && event.target.matches("a.dropdown-item")) {
        const servicioSeleccionado = event.target.getAttribute("data-value");
        document.getElementById("servicio").value = servicioSeleccionado; // Actualiza el campo oculto
        document.getElementById("servicioDropdown").textContent = servicioSeleccionado; // Actualiza el botón con el servicio seleccionado
    }
});


// Función para mostrar errores al usuario
const mostrarError = (mensaje) => {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger");
    errorDiv.textContent = mensaje;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000); // Eliminar el mensaje después de 3 segundos
};

// Función para buscar turnos por cliente
const buscarTurnoPorCliente = () => {
    const nombreCliente = document.getElementById("busquedaCliente").value.trim().toLowerCase();
    const listaResultados = document.getElementById("resultadosBusqueda");
    listaResultados.innerHTML = "";

    const resultados = turnos.filter(({ cliente }) => cliente.toLowerCase() === nombreCliente);

    if (resultados.length === 0) {
        listaResultados.innerHTML = `No se encontraron turnos para el cliente "${nombreCliente}".`;
    } else {
        resultados.forEach(({ id, telefono, direccion, email, auto, kilometros, servicio, fecha, hora }) => {
            const fechaFormateada = formatearFecha(fecha); // Usando el formato deseado
            const li = document.createElement("li");
            li.textContent = `ID: ${id}, Telefono: ${telefono}, Direccion: ${direccion}, Email: ${email}, Auto: ${auto}, Kilometros: ${kilometros}, Servicio: ${servicio} Fecha: ${fechaFormateada}, Hora: ${hora}`;
            listaResultados.appendChild(li);
        });
    }
};

// Función para mostrar todos los turnos
const mostrarTurnos = () => {
    const listaTurnos = document.getElementById("listaTurnos");
    listaTurnos.innerHTML = "";

    if (turnos.length === 0) {
        listaTurnos.innerHTML = "No hay turnos registrados.";
    } else {
        turnos.forEach(({ id, telefono, direccion, email, cliente, auto, kilometros, servicio, fecha, hora }) => {
            const fechaFormateada = formatearFecha(fecha); // Usando el formato deseado
            const li = document.createElement("li");
            li.textContent = `ID: ${id}, Cliente: ${cliente}, Telefono: ${telefono}, Direccion: ${direccion}, Email: ${email}, Auto: ${auto}, Kilometros: ${kilometros}, Servicio: ${servicio}, Fecha: ${fechaFormateada}, Hora: ${hora}`;
            listaTurnos.appendChild(li);
        });
    }
};

// Función para resetear los turnos
const resetTurnos = () => {
    const resetTurnos = document.querySelector(".resetTurnos");
    resetTurnos.addEventListener("click", () => {
        localStorage.clear();
        const listaTurnos = document.getElementById("listaTurnos");
        turnos = [];
        listaTurnos.innerHTML = "";
    });
};
resetTurnos();

// Función para formatear fecha a día-mes-año
const formatearFecha = (fechaISO) => {
    const [year, month, day] = fechaISO.split("-");
    return `${day}-${month}-${year}`; // Formato "día-mes-año"
};

// Cargar datos desde un archivo JSON (localStorage o un archivo local como ejemplo)
const cargarDatosDesdeJSON = async () => {
    try {
        const response = await fetch('./turnos.json'); // El archivo turnos.json debe estar en la misma carpeta
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON.");
        }
        const datos = await response.json();
        turnos = datos.turnos;
        localStorage.setItem("turnos", JSON.stringify(turnos)); // Guardar en localStorage
        mostrarTurnos();
    } catch (error) {
        mostrarError(error.message); // Mostrar el error en caso de fallo
    }
};

// Ejecutar la carga de datos desde el archivo JSON al cargar la página
cargarDatosDesdeJSON();

// Eventos
document.getElementById("registrarBoton").addEventListener("click", (event) => {
    event.preventDefault();
    registrarTurno();
});

document.getElementById("btnBuscar").addEventListener("click", (event) => {
    event.preventDefault();
    buscarTurnoPorCliente();
});

// Mostrar turnos al cargar la página
mostrarTurnos();
