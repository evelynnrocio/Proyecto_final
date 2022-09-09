//elementos DOM
const gmail = document.getElementById('gmail'),
contraseña = document.getElementById('contraseña'),
registro = document.getElementById('registro'),
botonIniciar = document.getElementById('login'),
modalEl = document.getElementById('modalLogin'),
modal = new bootstrap.Modal(modalEl),
toggles = document.querySelectorAll('.toggles'),
caja = document.querySelector('.anuncio'),
productoDOM = document.querySelector(".productos__center"),
carritoDOM = document.querySelector(".carrito"),
carritoCenter = document.querySelector(".carrito__center"),
openCarrito = document.querySelector(".carrito__icon"),
closeCarrito = document.querySelector(".close__carrito"),
overlay = document.querySelector(".carrito__overlay"),
carritoTotal = document.querySelector(".carrito__total"),
clearCarritoBtn = document.querySelector(".clear__carrito"),
itemTotales = document.querySelector(".item__total"),
detalles = document.getElementById('detalles')

//agregando libreria
Swal.fire({
	title: '¡Bienvenido/a al portal de Lilium!',
    text: 'Por favor, ingrese su usuario para poder ver los productos',
	width: 600,
	padding: '3em',
	color: '#716add',
	backdrop: `
            rgba(0,0,123,0.4)
            url("/img/colores.gif")
            left top
            no-repeat
            
        `
})
//usuarios registrados
const usuarios = [{
    nombre: 'Nahuel',
    mail: 'nahueeliasvarela@gmail.com',
    pass: 'dulce'
},
{
    nombre: 'Eve',
    mail: 'evelynnrocio@gmail.com',
    pass: 'verdeagua'
},
]
function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass,
    }
    storage.setItem('usuario', JSON.stringify(usuario));
}
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}
function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}
function saludar(usuario) {
    nombreUsuario.innerHTML = `¡Bienvenido/a, <span>${usuario.name}</span>!`
}
function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);
    if (typeof encontrado === 'undefined') {
        return false;
    } else {

        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}
botonIniciar.addEventListener('click', (e) => {
    e.preventDefault();

    if (!gmail.value || !contraseña.value) {
        alert('Todos los campos son requeridos');
    } else {
        let data = validarUsuario(usuarios, gmail.value, contraseña.value);
        if (!data) {
            alert(`Usuario y/o contraseña erróneos`);
        } else {
            if (registro.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            modal.hide();
            todoLosProductos(catalogo);
            presentarInfo(toggles, 'd-none');
        }
    }
});

btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
});
//inicio de carrito
let carrito = [];
let buttonDOM = [];

class UI {
	renderProductos(productos) {
		let result = ""
		productos.forEach((producto) => {
			result += `
			<div class="producto">
			<div class="image__container">
			<img src=${producto.image} alt="">
		</div>
        <div class="producto__footer">
            <h1>${producto.title}</h1>
            <div class="rating">
            <span>
            </div>
            <div class="price">$${producto.price}</div>
        </div>
        <div class="bottom">
            <div class="btn__group">
            <button class="btn addToCart" data-id=${producto.id}>Añadir al Carrito</button>
            <button class="btn">Comprar</button>
            </div>
        </div>
        </div>
				`
		});
		productoDOM.innerHTML = result
	}
	getButtons() {
		const buttons = [...document.querySelectorAll(".addToCart")];
		buttonDOM = buttons;
		buttons.forEach((button) => {
			const id = button.dataset.id;
			const inCart = carrito.find(item => item.id === parseInt(id, 10));
			if (inCart) {
				button.innerHTML = "En el carrito";
				button.disabled = true;
			}
			button.addEventListener("click", e => {
				e.preventDefault();
				e.target.innerHTML = "En el carrito";
				e.target.disabled = true;
				const carritoItem = { ...Storage.getProductos(id), cantidad: 1 }
				carrito = [...carrito, carritoItem]
				Storage.saveCart(carrito)
				this.setItemValues(carrito)
				this.addCarritoItem(carritoItem)
			})
		})
	}

	setItemValues(carrito) {
		let tempTotal = 0;
		let itemTotal = 0;
		carrito.map(item => {
			tempTotal += item.price * item.cantidad;
			itemTotal += item.cantidad;
		});
		carritoTotal.innerText = parseFloat(tempTotal.toFixed(2));
		itemTotales.innerText = itemTotal
	}
	addCarritoItem({ image, price, title, id }) {
		const div = document.createElement("div")
		div.classList.add("carrito__item")

		div.innerHTML = `
		<img src=${image} alt=${title}>
		<div>
			<h3>${title}</h3>
			<p class="price">$${price}</p>
		</div>
		<div>
			<span class="increase" data-id=${id}>
				<i class="bx bxs-up-arrow"></i>
			</span>
			<p class="item__cantidad">1</p>
			<span class="decrease" data-id=${id}>
				<i class="bx bxs-down-arrow"></i>
			</span>
		</div>
		<div>
			<span class="remove__item" data-id=${id}>
				<i class="bx bx-trash"></i>
			</span>
		</div>
		`
		carritoCenter.appendChild(div)
	}
	show() {
		carritoDOM.classList.add("show")
		overlay.classList.add("show")
	}
	hide() {
		carritoDOM.classList.remove("show")
		overlay.classList.remove("show")
	}
	setAPP() {
		carrito = Storage.getCart()
		this.setItemValues(carrito)
		this.populate(carrito)
		openCarrito.addEventListener("click", this.show)
		closeCarrito.addEventListener("click", this.hide)
	}
	populate(carrito) {
		carrito.forEach(item => this.addCarritoItem(item))
	}
	cartLogic() {
		clearCarritoBtn.addEventListener("click", () => {
			this.clearCarrito()
			this.hide()
		});

		carritoCenter.addEventListener("click", e => {
			const target = e.target.closest("span")
			const targetElement = target.classList.contains("remove__item");
			console.log(target)
			console.log(targetElement)
			if (!target) return
			if (targetElement) {
				const id = parseInt(target.dataset.id);
				this.removeItem(id)
				carritoCenter.removeChild(target.parentElement.parentElement)
			} else if (target.classList.contains("increase")) {
				const id = parseInt(target.dataset.id, 10);
				let tempItem = carrito.find(item => item.id === id);
				tempItem.cantidad++;
				Storage.saveCart(carrito)
				this.setItemValues(carrito)
				target.nextElementSibling.innerText = tempItem.cantidad
			} else if (target.classList.contains("decrease")) {
				const id = parseInt(target.dataset.id, 10);
				let tempItem = carrito.find(item => item.id === id);
				tempItem.cantidad--;

				if (tempItem.cantidad > 0) {
					Storage.saveCart(carrito);
					this.setItemValues(carrito);
					target.previousElementSibling.innerText = tempItem.cantidad;
				} else {
					this.removeItem(id);
					carritoCenter.removeChild(target.parentElement.parentElement)
				}
			}
		});
	}
	clearCarrito() {
		const cartItems = carrito.map(item => item.id)
		cartItems.forEach(id => this.removeItem(id))

		while (carritoCenter.children.length > 0) {
			carritoCenter.removeChild(carritoCenter.children[0])
		}
	}
	removeItem(id) {
		carrito = carrito.filter(item => item.id !== id);
		this.setItemValues(carrito)
		Storage.saveCart(carrito)
		let button = this.singleButton(id);
		if (button) {
			button.disabled = false;
			button.innerText = "Añadir carrito"
		}
	}
	singleButton(id) {
		return buttonDOM.find(button => parseInt(button.dataset.id) === id)
	}
}


class Storage {
	static saveProduct(obj) {
		localStorage.setItem("productos", JSON.stringify(obj))
	}
	static saveCart(carrito) {
		localStorage.setItem("carrito", JSON.stringify(carrito))
	}
	static getProductos(id) {
		const producto = JSON.parse(localStorage.getItem("productos"))
		return producto.find(product => product.id === parseFloat(id, 10))
	}
	static getCart() {
		return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];
	}
}


class Productos {
	async getProductos() {
		try {
			const result = await fetch("./js/data.json")
			const data = await result.json()
			const productos = data.items
			return productos
		} catch (err) {
			console.log(err)
		}
	}
}
let category = "";
let productos = [];
function categoryValue() {
	const ui = new UI();

	category = document.getElementById("category").value
	if (category.length > 0) {
		const producto = productos.filter(mas => mas.category === category)
		ui.renderProductos(producto)
		ui.getButtons();
	} else {
		ui.renderProductos(productos)
		ui.getButtons();

	}
}

const query = new URLSearchParams(window.location.search)
let id = query.get('id')

document.addEventListener("DOMContentLoaded", async () => {
	const productosLista = new Productos();
	const ui = new UI();

	ui.setAPP()

	productos = await productosLista.getProductos()
	if (id) {
		ui.detalleProducto(id)
		Storage.saveProduct(productos)
		ui.getButtons();
		ui.cartLogic();
	} else {
		ui.renderProductos(productos)
		Storage.saveProduct(productos)
		ui.getButtons();
		ui.cartLogic();
	}
})


caja.onmouseover = () => {
    caja.style.backgroundImage = 'url("img/anuncio1.jpg")';
    console.log('anuncio');
}