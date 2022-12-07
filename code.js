function efectos(tarea,mode, view){
    $(`.borrar.${tarea.getId()}`).click(function () {
        view.borrarDesdeBorrador($(this));
        mode.DesdeBorrador(view.getIdDesdeBorrador($(this)));
        localStorage.setItem('tareas', JSON.stringify(mode.tareas));
    });
    $('.fa-circle').click(function () {
        view.marcarComoHecho($(this));
        mode.marcarComoHecho(view.getIdDesdeTick($(this)));
        localStorage.setItem('tareas', JSON.stringify(mode.tareas));
    });
    $('.fa-circle-check').click(function () {
        view.desmarcarComoHecho($(this));
        mode.desmarcarComoHecho(view.getIdDesdeTick($(this)));
        localStorage.setItem('tareas', JSON.stringify(mode.tareas));
    });
    view.actualizarActuales()
    view.actualizarTotales()
}
function botones(mode, view){
    $(`.low`).click(function () {
        view.cambiarPrioridad($(this));
        mode.setPrioridad($(this).parent().parent().attr('id'), 1)
        reordenarVista(mode, view);
    });
    $(`.mid`).click(function () {
        view.cambiarPrioridad($(this));
        mode.setPrioridad($(this).parent().parent().attr('id'), 2)
        reordenarVista(mode, view);
    });
    $(`.high`).click(function () {
        view.cambiarPrioridad($(this));
        mode.setPrioridad($(this).parent().parent().attr('id'), 3)
        reordenarVista(mode, view);
    });
};
function reordenarVista(mode, view){
    mode.ordenarTareas();
    view.borrarTodo();
    for (let i = 0; i < mode.tareas.length; i++) {
        let tarea = mode.tareas[i];
        view.maquetarTareas(tarea);
        efectos(tarea ,mode, view);
        botones(mode, view);
    }
    localStorage.setItem('tareas', JSON.stringify(mode.tareas));
}

$(document).ready(function () {
    let mode = new Modelo();
    let view = new Vista();
    if(localStorage.getItem('tareas') != null){
        mode.leerLocalStorage();
        reordenarVista(mode, view);
    }
    $('input').keydown(function (e) {
        if (e.keyCode == 13) {//esto es para el enter
            view.borrarTodo();
            mode.agregarTarea($('#nuevaTarea'));
            for (let i = 0; i < mode.tareas.length; i++) {
                let tarea = mode.tareas[i];
                view.maquetarTareas(tarea);
                efectos(tarea ,mode, view);
                botones(mode, view);
            }
            localStorage.setItem('tareas', JSON.stringify(mode.tareas));
            $('#nuevaTarea').val('');
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
    DesdeBorrador(id) {
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
        localStorage.setItem('tareas', JSON.stringify(this.tareas));

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
    leerLocalStorage() {
        let LStareas = JSON.parse(localStorage.getItem('tareas'));
        let idAux = 0;
        for (let i = 0; i < LStareas.length; i++) {
            let nuevaTarea = new Tarea(LStareas[i].texto, LStareas[i].id, LStareas[i].prioridad, LStareas[i].hecho,  LStareas[i].fecha);
            if (LStareas[i].id > idAux)
                idAux = LStareas[i].id;
            this.tareas.push(nuevaTarea);
            }
        this.id = idAux + 1;
    }
}

class Vista {
    constructor() {
        this.div = $('#lista');
    }
    maquetarTareas(tarea) {
        $(`#lista`).append(`<div class="tarea ${tarea.getId()}" id="${tarea.getId()}">`);
        $(`#${tarea.getId()}`).append(`<div class="aceptar ${tarea.getId()}">`);
        $(`.aceptar.${tarea.getId()}`).append(`<div class="nombre ${tarea.getId()}">`);
        $(`.nombre.${tarea.getId()}`).append(`<i class="fa-regular fa-circle"></i><i class="fa-regular fa-circle-check"></i>`);
        $(`.nombre.${tarea.getId()}`).append(`<p>${tarea.getTexto()}</p>`);
        if (tarea.hecho) {
            $(`.nombre.${tarea.getId()} p`).addClass('hecho');
            $(`.nombre.${tarea.getId()} .fa-circle`).addClass('hecho');
            $(`.nombre.${tarea.getId()} .fa-circle-check`).addClass('hecho');
        }
        $(`#${tarea.getId()}`).append(`<div class="datos ${tarea.getId()}">`);
        $(`.datos.${tarea.getId()}`).append(`<p>Prioridad: </p><button class='low'><i class="fa-solid fa-caret-down"></i> Low</button> <button class='mid'>Normal</button> <button class='high'><i class="fa-sharp fa-solid fa-caret-up"></i> High</button>`);
        if (tarea.prioridad == 1) {
            $(`.datos.${tarea.getId()} .low`).addClass('seleccionado');
        } else if (tarea.prioridad == 2) {
            $(`.datos.${tarea.getId()} .mid`).addClass('seleccionado');
        } else if (tarea.prioridad == 3) {
            $(`.datos.${tarea.getId()} .high`).addClass('seleccionado');
        }
        $(`.datos.${tarea.getId()}`).append(`<p><i class="fa-solid fa-clock"></i> ${tarea.getFechaHaceXTiempo()}</p>`);
        $(`.aceptar.${tarea.getId()}`).append(`<div class="borrar ${tarea.getId()}">`);
        $(`.borrar.${tarea.getId()}`).append(`<i class="fa-solid fa-trash"></i>`);
    }
    borrarDesdeBorrador(boton) {
        let tarea = boton.parent().parent();
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
        let numero = $('.tarea').length - $('.fa-circle-check.hecho').length;
        $('.actuales').text(numero);
    }
    cambiarPrioridad(boton) {
        boton.parent().children().removeClass('seleccionado');
        boton.addClass('seleccionado');
    }
    getIdDesdeBorrador(boton) {
        return boton.parent().parent().attr('id');
    }
    getIdDesdeTick(tick) {
        return tick.parent().parent().parent().attr('id');
    }
}

class Tarea {
    constructor(texto, id, prioridad = 3, hecho = false, date = new Date()) {
        this.texto = texto;
        this.fecha = date;
        this.prioridad = prioridad;
        this.hecho = hecho;
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
        let diferencia = new Date() - new Date(this.fecha);
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