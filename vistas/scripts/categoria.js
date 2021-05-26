var tabla;

//funcion que se ejecuta al inicio
function init() {
    mostrarform(false);
    listar();

    $("#formulario").on("submit", function(e) {
        guardaryeditar(e);
    })
}

function limpiar() {
    $("#idcategoria").val("");
    $("#nombre").val("");
    $("#descripcion").val("");
}

function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
    } else {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
    }
}

function cancelarform() {
    limpiar();
    mostrarform(false);
}

function listar() {
    tabla = $('#tbllistado').DataTable({
        "aProcessing": true, //procesamiento datatables
        "aServerSide": true, //paginacion y filtrado
        dom: 'Bfrtip', //elementos de control de tabla
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdf'
        ],
        "ajax": {
            url: '../ajax/categoria.php?op=listar',
            type: "get",
            dataType: "json",
            error: function(e) {
                console.log(e.responseText);
            }
        },
        "bDestroy": true,
        "iDisplayLength": 5, //Paginacion de 5
        "order": [
            [0, "desc"]
        ]
    })
}

function guardaryeditar(e) {
    e.preventDefault();
    $("#btnGuardar").prop("disabled", true);
    var formData = new FormData($("#formulario")[0]);
    $.ajax({
        url: "../ajax/categoria.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,

        success: function(datos) {
            bootbox.alert(datos); //mostrar alerta si se a editado o actualizado
            mostrarform(false);
            tabla.ajax.reload(); //carga el datatable
        }
    });
    limpiar();
}

// Mostrar datos al editar un registro
function mostrar(idcategoria) {
    // data lo obtengo de la ruta op mostrar
    $.post("../ajax/categoria.php?op=mostrar", { idcategoria: idcategoria }, function(data, status) {
        data = JSON.parse(data);
        mostrarform(true);

        $("#nombre").val(data.nombre);
        $("#descripcion").val(data.descripcion);
        $("#idcategoria").val(data.idcategoria);

    })
}
//Funcion para desactivar registros
function desactivar(idcategoria) {
    bootbox.confirm("¿Está seguro de desactivar la categoría?", function(result) {
        if (result) { //Si el usuario dio a si
            $.post("../ajax/categoria.php?op=desactivar", { idcategoria: idcategoria }, function(e) { //puedo mandar mas parametros separando por comas
                bootbox.alert(e);
                tabla.ajax.reload();
            });
        }
    })
}
//Funcion para activar registros
function activar(idcategoria) {
    bootbox.confirm("¿Está seguro de activar la categoría?", function(result) {
        if (result) { //Si el usuario dio a si
            $.post("../ajax/categoria.php?op=activar", { idcategoria: idcategoria }, function(e) { //puedo mandar mas parametros separando por comas
                bootbox.alert(e);
                tabla.ajax.reload();
            });
        }
    })
}
init();