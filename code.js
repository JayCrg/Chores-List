
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
        mode.borrarTodo();
        view.borrarTodo();
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
            return b.prioridad - a.prioridad;
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
    marcarComoHecho(id) {
        this.getTarea(id).hecho = true;
    }
    desmarcarComoHecho(id) {
        let tarea = this.getTarea(id);
        tarea.hecho = false;
    }
    setPrioridad(id, prioridad) {
        let tarea = this.getTarea(id);
        tarea.prioridad = prioridad;
    }
}

class Vista {
    constructor() {
        this.div = $('#lista');
    }
    maquetarTareas(modelo) {
        let tarea
        console.log(modelo.tareas);
        for (let i = 0; i < modelo.tareas.length; i++) {
            tarea = modelo.tareas[i];
            $(`#lista`).append(`<div class="tarea ${tarea.getId()}" id="${tarea.getId()}">`);
            $(`#${tarea.getId()}`).append(`<div class="aceptar ${tarea.getId()}">`);
            $(`.aceptar.${tarea.getId()}`).append(`<div class="nombre ${tarea.getId()}">`);
            $(`.nombre.${tarea.getId()}`).append(`<i class="fa-regular fa-circle"></i><i class="fa-regular fa-circle-check"></i>`);
            $(`.nombre.${tarea.getId()}`).append(`<p>${tarea.getTexto()}</p>`);
            $(`#${tarea.getId()}`).append(`<div class="datos ${tarea.getId()}">`);
            $(`.datos.${tarea.getId()}`).append(`<p>Prioridad: </p><button class='low'><i class="fa-solid fa-caret-down"></i> Low</button> <button class='mid'>Normal</button> <button class='high'><i class="fa-sharp fa-solid fa-caret-up"></i> High</button>`);
            $(`.datos.${tarea.getId()}`).append(`<p><i class="fa-solid fa-clock"></i> ${tarea.getFechaHaceXTiempo()}</p>`);
            $(`.aceptar.${tarea.getId()}`).append(`<div class="borrar ${tarea.getId()}">`);
            $(`.borrar.${tarea.getId()}`).append(`<i class="fa-solid fa-trash"></i>`);

            $(`.borrar.${tarea.getId()}`).click(function () {
                view.borrarTarea($(this).parent().parent());
                mode.borrarTarea($(this).parent().parent().attr('id'));
            });

            $('.fa-circle').click(function () {
                view.marcarComoHecho($(this));
                modelo.marcarComoHecho($(this).parent().parent().parent().attr('id'));
            });
            $('.fa-circle-check').click(function () {
                view.desmarcarComoHecho($(this));
                modelo.desmarcarComoHecho($(this).parent().parent().parent().attr('id'));
            });
            $(`.low`).click(function () {
                view.cambiarPrioridad($(this));
                console.log($(this).parent().parent().attr('id'))
                modelo.setPrioridad($(this).parent().parent().attr('id'), 1)
                modelo.ordenarTareas();
            });
            $(`.mid`).click(function () {
                view.cambiarPrioridad($(this));
                modelo.setPrioridad($(this).parent().parent().attr('id'), 2)
                modelo.ordenarTareas();
            });
            $(`.high`).click(function () {
                view.cambiarPrioridad($(this));
                modelo.setPrioridad($(this).parent().parent().attr('id'), 3)
                modelo.ordenarTareas();
            });

            this.actualizarActuales()
            this.actualizarTotales()
        }

    }
    borrarTarea(tarea) {
        tarea.remove();
        this.actualizarTotales();
        this.actualizarActuales();
    }
    borrarTodo() {
        $('#lista').empty();
        this.actualizarActuales(0);
        this.actualizarTotales(0);
    }
    marcarComoHecho(tick) {
        tick.addClass('hecho');
        tick.next('i').addClass('hecho');
        tick.next('i').next('p').addClass('hecho');
        this.actualizarActuales();
    }
    desmarcarComoHecho(tick) {
        tick.removeClass('hecho');
        tick.prev('i').removeClass('hecho');
        tick.next('p').removeClass('hecho');
        this.actualizarActuales();
    }
    actualizarTotales() {
        let numero = $('.tarea').length;
        $('.totales').text(numero);
    }
    actualizarActuales() {
        let numero= $('.tarea').length - $('.fa-circle-check.hecho').length;
        $('.actuales').text(numero);
    }
    cambiarPrioridad(boton) {
        boton.parent().children().removeClass('seleccionado');
        boton.addClass('seleccionado');
    }

}

class Tarea {
    constructor(texto, id, prioridad = 3) {
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