
$(document).ready(function () {
    mode = new Modelo();
    view = new Vista();
    $('input').keydown(function (e) {
        if (e.keyCode == 13) {//esto es para el enter
            view.borrarTodo();
            tareaActual = mode.agregarTarea($('#nuevaTarea'));
            view.maquetarTareas(mode);
        }
    });
    $('#borrarTodo').click(function () {
        view.borrarTodo();
        mode.borrarTodo();
    });
    $('#delete').click(function () {
        console.log('click');
        // view.borrarTarea($(this).parent());
        // mode.borrarTarea($(this).parent().attr('id'));
    });

});


class Modelo {
    constructor() {
        this.tareas = [];
        this.id = 0;
    }
    agregarTarea(tarea) {
        let nuevaTarea = new Tarea(tarea.val(), this.id);
        this.tareas.push(nuevaTarea);
        this.id++;
        this.ordenarTareas();
        return nuevaTarea;
    }
    borrarTarea(id) {
        for (let i = 0; i < this.tareas.length; i++) {
            if (this.tareas[i].id == id) {
                this.tareas.splice(i, 1);
            }
        }
    }
    ordenarTareas() {
        this.tareas.sort((a, b) => {
            return a.prioridad - b.prioridad;
        })
    }
    borrarTodo() {
        this.tareas = [];
    }
    getTarea(id) {
        for (let i = 0; i < this.tareas.length; i++) {
            if (this.tareas[i].id == id) {
                return this.tareas[i];
            }
        }
    }
}

class Vista {
    constructor() {
        this.div = $('#lista');
    }
    maquetarTareas(modelo) {
        let tarea
        for(let i = 0; i < modelo.tareas.length; i++){
        tarea = modelo.tareas[i];
        $(`#lista`).append(`<div class="tarea ${tarea.getId()}" id="${tarea.getId()}">`);
        $(`#${tarea.getId()}`).append(`<div class="general ${tarea.getId()}">`);
        $(`.general.${tarea.getId()}`).append(`<div class="nombre ${tarea.getId()}">`);
        $(`.nombre.${tarea.getId()}`).append(`<i class="fa-regular fa-circle"></i><i class="fa-regular fa-circle-check"></i>`);
        $(`.nombre.${tarea.getId()}`).append(`<p>${tarea.getTexto()}</p>`);
        $(`.general.${tarea.getId()}`).append(`<div class="datos ${tarea.getId()}">`);
        $(`.datos.${tarea.getId()}`).append(`<p>Prioridad: <button class='low'><i class="fa-solid fa-caret-down"></i> Low</button> <button class='mid'>Mid</button> <button class='high'><i class="fa-sharp fa-solid fa-caret-up"></i> High</button></p>`);
        $(`.datos.${tarea.getId()}`).append(`<p><i class="fa-solid fa-clock"></i> ${tarea.getFechaHaceXTiempo()}</p>`);
        $(`#${tarea.getId()}`).append(`<div class="borrar ${tarea.getId()}"></div>`);
        $(`.borrar.${tarea.getId()}`).append(`<button id="delete"><i class="fa-solid fa-trash"></i></button>`);
        }

        // $('.fa-check').click(function () {
        //     $(this).parent().parent().css('background-color', 'grey');
        //     $(this).next('p').css('text-decoration', 'line-through');
        //     $(this).next('i').css('visibility', 'visible');
        // });
    }
    borrarTarea(tarea) {
        tarea.remove();
    }
    borrarTodo() {
        $('#lista').empty();
    }
    marcarComoHecho(tarea) {
        tarea.css('background-color', 'grey');
        tarea.children('p').css('text-decoration', 'line-through');
        tarea.children('i').css('visibility', 'visible');

    }
}

class Tarea {
    constructor(texto, id, prioridad = 2) {
        this.texto = texto;
        this.fecha = new Date();
        this.prioridad = prioridad;
        this.hecho = false;
        this.id = id;
    }
    cambiarPrioridad(prioridad) {
        this.prioridad = prioridad;
    }
    marcarComoHecha() {
        this.hecho = true;
    }
    marcarComoPendiente() {
        this.hecho = false;
    }
    getId() {
        return this.id;
    }
    getTexto() {
        return this.texto;
    }
    getFecha() {
        return this.fecha;
    }
    getFechaHaceXTiempo() {
        let fecha = this.fecha;
        let ahora = new Date();
        let diferencia = ahora - fecha;
        let segundos = Math.floor(diferencia / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let dias = Math.floor(horas / 24);
        let meses = Math.floor(dias / 30);
        let anios = Math.floor(meses / 12);
        if (anios > 0) {
            return anios + " años";
        } else if (meses > 0) {
            return meses + " meses";
        } else if (dias > 0) {
            return dias + " dias";
        } else if (horas > 0) {
            return horas + " horas";
        } else if (minutos > 0) {
            return minutos + " minutos";
        } else if (segundos > 0) {
            return segundos + " segundos";
        } else {
            return "ahora";
        }
    }
    getPrioridad() {
        return this.prioridad;
    }
}