var firebaseConfig = {
    apiKey: "AIzaSyClrS2wwvhI8HCrJT2-hNZP0_PM59nMi44",
    authDomain: "programacionweb-cd24f.firebaseapp.com",
    databaseURL: "https://programacionweb-cd24f.firebaseio.com",
    projectId: "programacionweb-cd24f",
    storageBucket: "programacionweb-cd24f.appspot.com",
    messagingSenderId: "941711100629",
    appId: "1:941711100629:web:5d6e6a522006633a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(entra);
//Variable para acceder a metodos de firestore
var db = firebase.firestore();

//Definimos variables para los input
var nombre = document.getElementById('nombreText');
var precio = document.getElementById('precioText');
var marca = document.getElementById('marcaText');
var categoria = document.getElementById('categoriaText');
var imagen = document.getElementById('imgText');
var oferta = document.getElementById('ofertaText');
var nuevo = document.getElementById('nuevo');
//Definimos variables para los botones
var btnGuardar = document.getElementById('guardar');
var btnActualizar = document.getElementById('actulaizar');

//Variable global para almacenar el id de la noticia
var idProducto = "";

//Metodo para almacenar la informacion en la BD. Evento del boton guardar
function guardarNoticia() {
    console.log(entra2);
    db.collection("productos").add({
            nombre: nombre.value,
            precio: precio.value,
            marca: marca.value,
            categoria: cagetoria.value,
            imagen: imagen.value
            
        })
        .then(function(docRef) {
            console.log("Documento guardado: ", docRef.id);
            listarNoticias();
        })
        .catch(function(error) {
            console.error("Error: ", error);
        });

}
//Metodo para listar las noticias almacenadas en la BD
function listarNoticias() {
    listaNoticia.innerHTML = "";
    db.collection("productos").get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
            listaNoticia.innerHTML += `
                <tr>
                    <td>${doc.data().nombre}</td>
                    <td>${doc.data().precio}</td>
                    <td>${doc.data().marca}</td>
                    <td>${doc.data().categoría}</td>
                    <td>${doc.data().imagen}</td>
                    <td>${doc.data().oferta}</td>
                    <td>${doc.data().nuevo}</td>
                   
                    <td>
                        <button onclick="verProducto('${doc.id}')" type="button" class="btn btn-default fas fa-edit"></button>
                        <button onclick="eliminarProducto('${doc.id}')" type="button" class="btn btn-default fas fa-trash-alt"></button>
                    </td>
                </tr>
            `;
        });
    });
}

//lee la noticia y la muestra en los input 
function verProducto(id) {;
    idNoticia = id;
    btnGuardar.classList.add('d-none');
    btnActualizar.classList.remove('d-none');
    db.collection("productos").doc(id)
        .onSnapshot(async function(doc) {
            nombre.value = doc.data().nombre;
            precio.value = doc.data().precio;
            marca.value = doc.data().marca;
            categoria.value = doc.data().categoria;
            nombre.value = doc.data().nombre;
            imagen.value = doc.data().imagen;
            oferta.value = doc.data().oferta;
            nuevo.value = doc.data().nuevo;
            

        });
}

function actualizarNoticia() {
    var dato = db.collection("productos").doc(idProducto);

    dato.update({
        nombre: nombre.value,
        precio: precio.value,
        marca: marca.value,
        categoria: cagetoria.value,
        imagen: imagen.value,
        oferta: oferta.value,
        nuevo:nuevo.value
        })
        .then(function() {
            console.log('Producto actualizado');
            btnGuardar.classList.remove('d-none');
            btnActualizar.classList.add('d-none');
            listarNoticias();
        })
        .catch(function(err) {
            console.error("Error: ", err);
        })
}

//Metodo para eliminar Noticas xGlgqB70TusBLPqx3Bct
function eliminarProducto(id) {
    var dato = db.collection("Noticias").doc(id).delete()
        .then(function() {
            console.log("Noticia Eliminada!");
            listarNoticias();
        }).catch(function(error) {
            console.error("Error: ", error);
        });

}

listarNoticias();