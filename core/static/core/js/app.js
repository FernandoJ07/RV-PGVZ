document.addEventListener('DOMContentLoaded', function() {
	if(window.location.pathname.split('/')[1] === 'clientes') {

		fill_table('clientes');
        
		// Modal Agregar cliente
		$('#btn_cliente_modal_agregar').on('click', function() {
			modal('#agregarClienteModal', 'show');

		});

		// Agregar cliente
		$('#form_cliente_agregar').submit(function(e) {
			var form_agregar_data = $('#form_cliente_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			
			fetch('/api/clientes/',{
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				console.log(result)
		    	if(!result.error) {
		    		bootstrapAlert('Cliente registrado con éxito', 'success');
					modal('#agregarClienteModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#agregarClienteModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de clientes', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarClienteModal', 'hide');
		    		bootstrapAlert('Cliente no está registrado', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe cliente registrado con esta cédula de identidad', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');

		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del cliente!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del cliente!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar cliente
		$('#form_cliente_modificar').submit(function(e) {
			clientes_selected_id = document.querySelector('#clientes_selected_id').value;
			var form_modificar_data = $('#form_cliente_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/clientes/' + clientes_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		bootstrapAlert('Cliente modificado con éxito', 'success');
		    		modal('#modificarClienteModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarClienteModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de clientes', 'error');
		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarClienteModal', 'hide');
		    		bootstrapAlert('Cliente no está registrado', 'error');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe cliente registrado con esta cédula de identidad', 'error');
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del cliente!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del cliente!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Eliminar cliente
		$('#btn_cliente_eliminar').on('click', function() {
			clientes_selected_id = document.querySelector('#clientes_selected_id').value;

			fetch('/api/clientes/' + clientes_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
					modal('#eliminarClienteModal', 'hide');
		    		bootstrapAlert('Cliente eliminado correctamente', 'success');

		    		setTimeout(() => {
						fill_table('clientes');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarClienteModal', 'hide');
		    		bootstrapAlert('Cliente no está registrado', 'error');
		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarClienteModal', 'hide');
		    		bootstrapAlert('Tu cuenta no tiene permisos para eliminar clientes', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al eliminar cliente');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar cliente', 'error');
		    	console.log('Error: ' + error);
		    });
		});
	}

	if(window.location.pathname.split('/')[1] === 'proveedores') {

		// Agregar proveedor
		$('#btn_proveedor_modal_agregar').on('click', function() {
			modal('#agregarProveedorModal', 'show');
		});
        
		// Agregar proveedor
		$('#form_proveedor_agregar').submit(function(e) {
			var form_agregar_data = $('#form_proveedor_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			
			fetch('/api/proveedores/',{
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				console.log(result)
		    	if(!result.error) {
		    		bootstrapAlert('Proveedor registrado con éxito', 'success');
					modal('#agregarProveedorModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('proveedores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#agregarProveedorModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de proveedoress', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarProveedorModal', 'hide');
		    		bootstrapAlert('Proveedor no está registrado', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe Proveedor registrado con esta cédula de identidad', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');

		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar Proveedor
		$('#form_proveedor_modificar').submit(function(e) {
			proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;
			var form_modificar_data = $('#form_proveedor_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/proveedores/' + proveedores_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		bootstrapAlert('Proveedor modificado con éxito', 'success');
		    		modal('#modificarProveedorModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('proveedores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarProveedorModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de Proveedors', 'error');
		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarProveedorModal', 'hide');
		    		bootstrapAlert('Proveedor no está registrado', 'error');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe Proveedor registrado con esta cédula de identidad', 'error');
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Eliminar Proveedor
		$('#btn_proveedor_eliminar').on('click', function() {
			proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;

			fetch('/api/proveedores/' + proveedores_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
					modal('#eliminarProveedorModal', 'hide');
		    		bootstrapAlert('Proveedor eliminado correctamente', 'success');

		    		setTimeout(() => {
						fill_table('proveedores');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarProveedorModal', 'hide');
		    		bootstrapAlert('Proveedor no está registrado', 'error');
		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarProveedorModal', 'hide');
		    		bootstrapAlert('Tu cuenta no tiene permisos para eliminar Proveedors', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al eliminar Proveedor');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar Proveedor', 'error');
		    	console.log('Error: ' + error);
		    });
		});


        fill_table('proveedores');
	}

	if(window.location.pathname.split('/')[1] === 'usuarios') {
        
		// Modal Agregar usuario
		$('#btn_usuario_modal_agregar').on('click', function() {
			modal('#agregarUsuarioModal', 'show');
		});

		// Agregar usuario
		$('#form_usuario_agregar').submit(function(e) {
			var form_agregar_data = $('#form_usuario_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			
			fetch('/api/usuarios/',{
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {

		    	if(!result.error) {
		    		
					bootstrapAlert(result.message, 'success');
					modal('#agregarUsuarioModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('usuarios');
		    		}, 100);

				} else if(result.error == 'No permission.') {
					modal('#agregarUsuarioModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de usuarios', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarUsuarioModal', 'hide');
		    		bootstrapAlert('usuario no está registrado', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe usuario registrado con esta cedula', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');

		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del usuario!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del usuario!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		
		// Modificar usuario
		$('#form_usuario_modificar').submit(function(e) {
			usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;
			var form_modificar_data = $('#form_usuario_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/usuarios/' + usuarios_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		bootstrapAlert('Usuario modificado con éxito', 'success');
		    		modal('#modificarUsuarioModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('usuarios');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarUsuarioModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de Usuarios', 'error');
		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarUsuarioModal', 'hide');
		    		bootstrapAlert('Usuario no está registrado', 'error');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe Usuario registrado con esta cédula de identidad', 'error');
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del Usuario!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del Usuario!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});


		// Modal eliminar usuario
		$('#btn_usuario_eliminar').on('click', function() {
			usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;

			fetch('/api/usuarios/' + usuarios_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
					modal('#eliminarUsuarioModal', 'hide');
		    		bootstrapAlert('Usuario eliminado correctamente', 'success');

		    		setTimeout(() => {
						fill_table('usuarios');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarUsuarioModal', 'hide');
		    		bootstrapAlert('Usuario no está registrado', 'error');
		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarUsuarioModal', 'hide');
		    		bootstrapAlert('Tu cuenta no tiene permisos para eliminar Usuarios', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al eliminar Usuario');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar Usuario', 'error');
		    	console.log('Error: ' + error);
		    });
		});

        fill_table('usuarios');
	}
	
	if(window.location.pathname.split('/')[1] === 'productos') {
		// Modal Agregar producto
		$('#btn_producto_modal_agregar').on('click', function() {
			modal('#agregarProductoModal', 'show');

		});

		$('#producto_agregar_tipo').on('change', function () {
			const container_producto_agregar_caucho = document.querySelector('#container_producto_agregar_caucho');
			const container_producto_agregar_rin = document.querySelector('#container_producto_agregar_rin');
			const selected_value = this.value;

			if(selected_value == '2') {
				container_producto_agregar_caucho.style.display = 'block';
				container_producto_agregar_rin.style.display = 'none';

			} else if(selected_value == '3') {
				container_producto_agregar_caucho.style.display = 'none';
				container_producto_agregar_rin.style.display = 'block';

			} else {
				container_producto_agregar_caucho.style.display = 'none';
				container_producto_agregar_rin.style.display = 'none';
			}


			/* const precio = $("option[value=" + $(this).val() + "]", this).attr('data-precio');
			const cantidad = $("option[value=" + $(this).val() + "]", this).attr('data-cantidad');

			this.parentElement.parentElement.parentElement.querySelector('.input_precio').value = precio;
			this.parentElement.parentElement.parentElement.querySelector('.input_precio_original').value = precio;
			this.parentElement.parentElement.parentElement.querySelector('.input_cantidad').value = 1;
			this.parentElement.parentElement.parentElement.querySelector('.input_cantidad').max = cantidad; */
		});

		// Agregar producto
		$('#form_producto_agregar').submit(function(e) {
			var form_agregar_data = $('#form_producto_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			
			fetch('/api/productos/',{
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				console.log(result);

		    	if(!result.error) {
		    		bootstrapAlert('Producto registrado con éxito', 'success');
					
					modal('#agregarProductoModal', 'hide');
		    		this.reset();

					document.querySelector('#container_producto_agregar_caucho').style.display = 'none';
					document.querySelector('#container_producto_agregar_rin').style.display = 'none';

		    		setTimeout(() => {
		    			fill_table('productos');
		    		}, 100);
					
				} else if(result.error == 'No permission.') {
					modal('#agregarProductoModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de usuarios', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarProductoModal', 'hide');
		    		bootstrapAlert('usuario no está registrado', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe usuario registrado con este rif', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');

		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del usuario!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del usuario!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar producto
		$('#form_producto_modificar').submit(function(e) {
			productos_selected_id = document.querySelector('#productos_selected_id').value;
			var form_modificar_data = $('#form_producto_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/productos/' + productos_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		bootstrapAlert('Producto modificado con éxito', 'success');

		    		modal('#modificarProductoModal', 'hide');
		    		this.reset();

					document.querySelector('#container_producto_modificar_caucho').style.display = 'none';
					document.querySelector('#container_producto_modificar_rin').style.display = 'none';

		    		setTimeout(() => {
		    			fill_table('productos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarProductoModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de Proveedors', 'error');
		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarProductoModal', 'hide');
		    		bootstrapAlert('Proveedor no está registrado', 'error');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe Proveedor registrado con esta cédula de identidad', 'error');
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'error');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!', 'error');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Sumar cantidad producto
		$('#producto_cantidad_sumar').on('click', function() {
			const productos_selected_id = document.querySelector('#productos_selected_id').value;
			const productos_cantidad_valor = document.querySelector('#producto_cantidad_valor').value;

			const data = {
				producto_id: productos_selected_id,
				cantidad: productos_cantidad_valor
			}

			fetch('/api/productos/' + productos_selected_id + '/add', {
		    	method: 'PATCH',
		    	body: JSON.stringify(data)
		   	})

			.then(response => response.json())
			.then(result => {
				if(!result.error) {
					bootstrapAlert('Cantidad de producto sumada con éxito', 'success');

					modal('#cantidadProductoModal', 'hide');
					document.querySelector('#producto_cantidad_valor').value = 0;

					setTimeout(() => {
						fill_table('productos');
					}, 100);
				} else if(result.error == 'No permission.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de Proveedors', 'error');

				} else if(result.error == 'DoesNotExist.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Proveedor no está registrado', 'error');

				} else if(result.error == 'CedulaNotUnique.') {
					bootstrapAlert('Ya existe Proveedor registrado con esta cédula de identidad', 'error');

				} else if(result.error == 'ValueError.') {
					bootstrapAlert('Ingrese todos los campos correctamente', 'error');

				} else {
					bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!');
				}
			})
			.catch(function(error) {
				bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!', 'error');
				console.log('Error: ' + error);
			});
		});

		// Restar cantidad producto
		$('#producto_cantidad_restar').on('click', function() {
			const productos_selected_id = document.querySelector('#productos_selected_id').value;
			const productos_cantidad_valor = document.querySelector('#producto_cantidad_valor').value;

			const data = {
				producto_id: productos_selected_id,
				cantidad: productos_cantidad_valor
			}

			fetch('/api/productos/' + productos_selected_id + '/remove', {
		    	method: 'PATCH',
		    	body: JSON.stringify(data)
		   	})

			.then(response => response.json())
			.then(result => {
				if(!result.error) {
					bootstrapAlert('Cantidad de producto restada con éxito', 'success');

					modal('#cantidadProductoModal', 'hide');
					document.querySelector('#producto_cantidad_valor').value = 0;

					setTimeout(() => {
						fill_table('productos');
					}, 100);
				} else if(result.error == 'No permission.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para modificar información de Proveedors', 'error');

				} else if(result.error == 'DoesNotExist.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Proveedor no está registrado', 'error');

				} else if(result.error == 'CedulaNotUnique.') {
					bootstrapAlert('Ya existe Proveedor registrado con esta cédula de identidad', 'error');

				} else if(result.error == 'ValueError.') {
					bootstrapAlert('Ingrese todos los campos correctamente', 'error');

				} else {
					bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!');
				}
			})
			.catch(function(error) {
				bootstrapAlert('Ha ocurrido un error al modificar la información del Proveedor!', 'error');
				console.log('Error: ' + error);
			});
		});
		

		fill_table('productos');
	}

	if(window.location.pathname.split('/')[1] === 'registro-ventas') {
		const clients_options = document.querySelector('#clients_options');

		updateProductSelect();

		//Busca y rellena el select para seleccionar un cliente para la venta
		fetch('/api/clientes')
		.then(response => response.json())
		.then(data => {
			data.forEach(cliente => {
				var opt = document.createElement('option');
				opt.value = cliente.id;
				opt.innerHTML = cliente.names;
				clients_options.appendChild(opt);
			});

		})
		.catch(function(error) {console.log('Error buscar clientes: ' + error);});

		setTimeout(() => {
			$(clients_options).selectpicker();
		}, 500);

		
		//Añade la información correspondiente al producto que está en el selectpicker oculto y lo añade a los que se generan en la tabla de venta
		$('#venta_agregar_productos tbody').off('change', '.selectpicker');
		$('#venta_agregar_productos tbody').on('change', '.selectpicker', function () {
			const precio = $("option[value=" + $(this).val() + "]", this).attr('data-precio');
			const cantidad = $("option[value=" + $(this).val() + "]", this).attr('data-cantidad');

			this.parentElement.parentElement.parentElement.querySelector('.input_precio').value = precio;
			this.parentElement.parentElement.parentElement.querySelector('.input_precio_original').value = precio;
			this.parentElement.parentElement.parentElement.querySelector('.input_cantidad').value = 1;
			this.parentElement.parentElement.parentElement.querySelector('.input_cantidad').max = cantidad;
		});

		//Actualiza el precio dependiendo de la cantidad del producto que se añada
		$(document).on('change, mouseup, keyup, input', '#venta_agregar_productos tbody .input_cantidad', function () {
			const cantidad = $(this).val();
			const precio = $(this).closest('tr').find('.input_precio_original').val();

			if(cantidad == $(this).attr('max')){
				bootstrapAlert('Llegó al límite de unidades en el inventario', 'warning');
			}
			
			$(this).closest('tr').find('.input_precio').val(precio * cantidad);
		});

		$('#btn_generar_venta').on('click', function() {

			const clienteId = document.getElementById('clients_options').options[document.getElementById('clients_options').selectedIndex].value;
			const productos = productos_get_table_data("venta_agregar_productos")

			const data = {
				cliente: clienteId,
				productos: productos
			}

			fetch('/api/ventas/', {
		    	method: 'POST',
		    	body: JSON.stringify(data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				if (result.message) {
					updateProductSelect();
					producto_reset_table("venta_agregar_productos");
					
					bootstrapAlert(result.message, 'success');
				} else if (result.error) {
					bootstrapAlert(result.error, 'danger');
				}
		    })
		    .catch(function(error) {
		    	console.log('Error: ' + error);
				bootstrapAlert('Error en la conexión o respuesta del servidor.', 'danger');
		    });
		});

	};

	if(window.location.pathname.split('/')[1] === 'ventas') {


		// Generar venta
		$('#btn_generar_factura').on('click', function() {
			venta_id = $('#generar_factura_id').val();
			descripcion = $('#factura_descripcion').val();

			const data = {
				venta_id: venta_id,
				descripcion: descripcion
			}

			fetch('/api/facturas/', {
		    	method: 'POST',
		    	body: JSON.stringify(data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#generarFacturaModal').modal('hide');
		    		bootstrapAlert(result.success, 'success');
					$('#factura_descripcion').val("")

		    		setTimeout(() => {
						fill_table('ventas');
					}, 100);
		    	}else {
		    		bootstrapAlert(result.error, 'warning');
		    	}
				
		    	// else if(result.error == 'No permission.') {
		    	// 	$('#eliminarClienteModal').modal('hide');
		    	// 	bootstrapToast('Tu cuenta no tiene permisos para eliminar clientes', 'info');
		    	// } 
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar cliente', 'danger');
		    	console.log('Error: ' + error);
		    });
		});

		//Ver factura
		$('#tabla_ventas tbody').off('click', '.btn_reporte_factura');
		$('#tabla_ventas tbody').on('click', '.btn_reporte_factura', function () {
			row = $(this).parents('tr')[0];
			venta_id = row.cells[0].innerHTML;

			if (venta_id) {
				fetch('/api/facturas/' + venta_id)
				.then(response => response.json())
				.then(data => {
					if (data.error) {
						bootstrapAlert('No se ha seleccionado ninguna factura');
					} else if (data.mensaje) {
						bootstrapAlert(data.mensaje);
					} else {
						window.open('http://' + location.host + '/pdf/factura/' + data.id, '_blank');
					}
				})
				.catch(error => {
					console.error('Error en la petición:', error);
				});
			}
		});


        fill_table('ventas');
	}

	if(window.location.pathname.split('/')[1] === 'transacciones') {
        fill_table('transacciones');
	}
	
	if(window.location.pathname.split('/')[1] === 'facturas') {
		$('#btn_factura_modal_detalles').on('click', function() {
			$('#detallesFacturaModal').modal('show');
		});
	};

	if(window.location.pathname.split('/')[1] === 'servicios') {

        fill_table('servicios');
        
		// Agregar servicio
		$('#btn_servicio_modal_agregar').on('click', function() {
			modal('#agregarServicioModal', 'show');
		});

		// Agregar servicio
		$('#form_servicio_agregar').submit(function(e) {

			const form_agregar_data = $('#form_servicio_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/servicios/', {
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				if(!result.error) {
					bootstrapAlert(result.message, 'success');
					modal('#agregarServicioModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('servicios');
		    		}, 100);

				}
				else {
					bootstrapAlert('Error al registrar el servicio!', 'danger');
				}
		    })
		    .catch(function(error) {
				bootstrapAlert('Error en la conexión o respuesta del servidor.', 'danger');
		    });

			e.preventDefault();
		});

		// Modificar servicio
		$('#form_servicio_modificar').submit(function(e) {
			servicio_id = document.querySelector('#servicios_selected_id').value;
			form_modificar_data = $('#form_servicio_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			
			fetch('/api/servicios/' + servicio_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		bootstrapAlert('Servicio modificado con éxito', 'success');
		    		modal('#modificarServicioModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('servicios');
		    		}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		bootstrapAlert('Servicio no está registrado', 'warning');
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Ingrese todos los campos correctamente', 'warning');
		    	} else {
		    		bootstrapAlert('Ha ocurrido un error al modificar la información del servicio!', 'warning');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al modificar la información del servicio!', 'warning');
		    });

			e.preventDefault();

		});

		// Eliminar servicio
		$('#btn_usuario_eliminar').on('click', function() {
			servicios_selected_id = document.querySelector('#servicios_selected_id').value;

			fetch('/api/servicios/' + servicios_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
					modal('#eliminarServicioModal', 'hide');

		    		bootstrapAlert('Servicio eliminado correctamente', 'success');
		    		setTimeout(() => {
						fill_table('servicios');
					}, 100);

		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#eliminarServicioModal', 'hide');
		    		bootstrapAlert('Servicio no está registrado', 'warning');
		    	}else if(result.error == 'No permission.') {
					modal('#eliminarServicioModal', 'hide');
					bootstrapAlert('Tu cuenta no tiene permisos para eliminar servicios', 'info');
				}else {
		    		bootstrapAlert('Ha ocurrido un error al eliminar servicio', 'error');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar servicio', 'error');
		    });
		});

		

	}

	if(window.location.pathname.split('/')[1] === 'registro-servicios') {
		const clients_options = document.querySelector('#clients_options');

		updateServicesSelect();

		//Busca y rellena el select para seleccionar un cliente para la venta
		fetch('/api/clientes')
		.then(response => response.json())
		.then(data => {
			data.forEach(cliente => {
				var opt = document.createElement('option');
				opt.value = cliente.id;
				opt.innerHTML = cliente.names;
				clients_options.appendChild(opt);
			});

		})
		.catch(function(error) {console.log('Error buscar clientes: ' + error);});

		setTimeout(() => {
			$(clients_options).selectpicker();
		}, 500);
		
		//Añade la información correspondiente al producto que está en el selectpicker oculto y lo añade a los que se generan en la tabla de venta
		$('#registro_agregar_servicios tbody').off('change', '.selectpicker');
		$('#registro_agregar_servicios tbody').on('change', '.selectpicker', function () {
			const precio = $("option[value=" + $(this).val() + "]", this).attr('data-precio');

			this.parentElement.parentElement.parentElement.querySelector('.input_precio').value = precio;
			this.parentElement.parentElement.parentElement.querySelector('.input_precio_original').value = precio;
		});

		$(document).on('change, mouseup, keyup, input', '#registro_agregar_servicios tbody .input_cantidad', function () {
			const precio = $(this).closest('tr').find('.input_precio_original').val();
			$(this).closest('tr').find('.input_precio').val(precio);
		});

		$('#btn_generar_servicio_facturado').on('click', function() {
			const clienteId = document.getElementById('clients_options').options[document.getElementById('clients_options').selectedIndex].value;
			const servicios = servicios_get_table_data("registro_agregar_servicios")

			const data = {
				cliente: clienteId,
				servicios: servicios
			}

			fetch('/api/servicio-facturado/', {
		    	method: 'POST',
		    	body: JSON.stringify(data)
		   	})
		    .then(response => response.json())
		    .then(result => {
				if (result.message) {
					updateProductSelect();
					servicio_reset_table("registro_agregar_servicios");
					
					bootstrapAlert(result.message, 'success');
				} else if (result.error) {
					bootstrapAlert(result.error, 'danger');
				}
		    })
		    .catch(function(error) {
		    	console.log('Error: ' + error);
				bootstrapAlert('Error en la conexión o respuesta del servidor.', 'danger');
		    });
		});

	};

	if(window.location.pathname.split('/')[1] === 'servicio-facturado') {

        fill_table('servicio-facturado');

		

		// Modal generar Factura
		$('#tabla_servicios_facturados tbody').off('click', '.btn_venta_modal_factura');
		$('#tabla_servicios_facturados tbody').on('click', '.btn_venta_modal_factura', function () {
			row = $(this).parents('tr')[0];
			venta_id = row.cells[0].innerHTML;
			$('#generar_factura_id').val(venta_id)
			$('#generarFacturaModal').modal('show');
		});

		//Ver factura servicio
		$('#tabla_servicios_facturados tbody').off('click', '.btn_reporte_factura_servicio');
		$('#tabla_servicios_facturados tbody').on('click', '.btn_reporte_factura_servicio', function () {
			row = $(this).parents('tr')[0];
			factura_servicio_id = row.cells[0].innerHTML;

			window.open('http://' + location.host + '/pdf/factura_servicio/' + factura_servicio_id, '_blank');
		});

		// Generar Factura
		$('#btn_generar_factura').on('click', function() {
			venta_id = $('#generar_factura_id').val();
			descripcion = $('#factura_descripcion').val();

			const data = {
				venta_id: venta_id,
				descripcion: descripcion
			}

			fetch('/api/facturas/', {
		    	method: 'POST',
		    	body: JSON.stringify(data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#generarFacturaModal').modal('hide');
		    		bootstrapAlert(result.success, 'success');
					$('#factura_descripcion').val("")

		    		setTimeout(() => {
						fill_table('ventas');
					}, 100);
		    	}else {
		    		bootstrapAlert(result.error, 'warning');
		    	}
				
		    	// else if(result.error == 'No permission.') {
		    	// 	$('#eliminarClienteModal').modal('hide');
		    	// 	bootstrapToast('Tu cuenta no tiene permisos para eliminar clientes', 'info');
		    	// } 
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Ha ocurrido un error al eliminar cliente', 'danger');
		    	console.log('Error: ' + error);
		    });
		});
	}

});

function updateServicesSelect() {
	const services_options = document.querySelector('#services_options');

	$(services_options).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar servicio</option>');
	
	fetch('/api/servicios')
	.then(response => response.json())
	.then(data => {
		data.forEach(servicio => {
			var opt = document.createElement('option');
			opt.value = servicio.codigo;
			opt.innerHTML = servicio.nombre;
			opt.dataset.precio = servicio.precio;
			services_options.appendChild(opt);
			
		});

		servicio_reset_table('registro_agregar_servicios');
	})
	.catch(function(error) {console.log('Error buscar servicios: ' + error);});
}

function updateProductSelect() {
	const product_options = document.querySelector('#product_options');

	$(product_options).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar producto</option>');
	
	fetch('/api/productos')
	.then(response => response.json())
	.then(data => {
		data.forEach(producto => {
			if(producto.cantidad > 0){
				var opt = document.createElement('option');
				opt.value = producto.id;
				opt.innerHTML = producto.nombre;
				opt.dataset.cantidad = producto.cantidad;
				opt.dataset.precio = producto.precio;
				product_options.appendChild(opt);
			}
			
		});

		producto_reset_table('venta_agregar_productos');
	})
	.catch(function(error) {console.log('Error buscar productos: ' + error);});
}

function generar_div(nombre_label, valor_input, contenedor){


	const label = document.createElement('label');
	label.classList.add('block', 'text-sm', 'text-gray');

	const span = document.createElement('span')
	span.classList.add('text-gray-700', 'dark:text-gray-400')
	span.textContent = nombre_label;

	const input = document.createElement('input');
	input.classList.add('block', 'w-full', 'mt-1', 'text-sm', 'dark:border-gray-600', 'dark:bg-gray-700', 'focus:border-purple-400', 'focus:outline-none', 'focus:shadow-outline-purple', 'dark:text-gray-300', 'dark:focus:shadow-outline-gray', 'form-input');
	input.setAttribute('readonly', 'readonly');
	input.value = valor_input;

	label.appendChild(span);
	label.appendChild(input);

	contenedor.appendChild(label);
}

function bootstrapAlert(message, type) {
	$('.bootstrap-growl').alert('close');

	$.bootstrapGrowl(message, {
		ele: 'body', // which element to append to
		type: type, // (null, 'info', 'error', 'success')
		offset: {from: 'bottom', amount: 30}, // 'top', or 'bottom'
		align: 'center', // ('left', 'right', or 'center')
		width: 800, // (integer, or 'auto')
		delay: 3000,
		allow_dismiss: true,
		stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

function fill_table(tipo) {
	if (tipo === 'clientes') {
		$("#tabla_clientes thead").hide();

        table = $('#tabla_clientes').DataTable({
            'dom': 'Bfrtip',
			'buttons': [
				{
					'name': 'btn_detalles_cliente',
					'text': 'Detalles cliente',
					'attr':  {
						'id': 'btn_detalles_cliente', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(!clientes_selected_id) {
								alert('No hay cliente seleccionado');
								return;
							}

							fetch('/api/clientes/' + clientes_selected_id)
							.then(response => response.json())
							.then(cliente => {
								document.querySelector('#cliente_detalles_cedula').value = cliente.cedula;
								document.querySelector('#cliente_detalles_nombres').value = cliente.fullname;
								document.querySelector('#cliente_detalles_num_tlf').value = cliente.num_tlf;
								document.querySelector('#cliente_detalles_email').value = cliente.email;
								document.querySelector('#cliente_detalles_direccion').value = cliente.direccion;
							})
							.catch(function(error) {
								//toastr.error('Ha ocurrido un error al buscar el cliente');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#detallesClienteModal', 'show');
						}
				},
				{
					'name': 'btn_modificar_cliente',
					'text': 'Modificar',
					'attr':  {
						'id': 'btn_modificar_cliente', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(!clientes_selected_id) {
								alert('No hay cliente seleccionado');
								return;
							}

							fetch('/api/clientes/' + clientes_selected_id)
							.then(response => response.json())
							.then(cliente => {
								document.querySelector('#cliente_modificar_cedula').value = cliente.cedula;
								document.querySelector('#cliente_modificar_nombres').value = cliente.fullname;
								document.querySelector('#cliente_modificar_num_tlf').value = cliente.num_tlf;
								document.querySelector('#cliente_modificar_email').value = cliente.email;
								document.querySelector('#cliente_modificar_direccion').value = cliente.direccion;
							})
							.catch(function(error) {
								bootstrapAlert('Ha ocurrido un error al buscar el cliente', 'info');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#modificarClienteModal', 'show');
						}
				},
				{
					'name': 'btn_toggle_cliente',
					'text': 'Eliminar',
					'attr':  {
						'id': 'btn_toggle_cliente', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							modal('#eliminarClienteModal', 'show');
						}
				}
			],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
            'language': { 'url': '/media/datatables-languages/es-ES_custom.json' },
            'ajax': {
                'url': '/api/clientes',
                'type': 'GET',
                'dataSrc': '',
                'error': function (jqXHR, ajaxOptions, thrownError) {
                    bootstrapAlert('Ha ocurrido un error al cargar la lista de clientes', 'error');
                    console.log('Error buscar clientes: ' + thrownError);
                }
            },
            'columns': [
                {
                    render: function (data, type, row, meta) {
                        const html = `
                        	<input type="hidden" name="cliente_id" value="${row.id}">

							<div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
								<p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
									${row.shortname}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.cedula}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.num_tlf}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.email}
								</p>
							</div>
                        `;

                        return html;
                    }
                },
            ],
            
        });

		$('#tabla_clientes tbody').off('click', 'tr').on('click', 'tr', function () {
			const clientes_selected = document.querySelector('#clientes_selected_id');
			const current_cliente = this.querySelector('input[name="cliente_id"]') ? this.querySelector('input[name="cliente_id"]').value : '';

			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				clientes_selected.value = '';
			} else {
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				clientes_selected.value = current_cliente;
			}

			btn_disabled_value = (clientes_selected.value == '');
	
			table.button('btn_detalles_cliente:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_modificar_cliente:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_toggle_cliente:name').nodes().attr('disabled', btn_disabled_value);
		});

		table.on('draw', function(data) {
			$('#tabla_clientes tbody').addClass('flex flex-wrap');
			$('#tabla_clientes tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
		});


	}else if(tipo === 'usuarios') {
		
		$("#tabla_usuarios thead").hide();
        
		table = $('#tabla_usuarios').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_usuario',
                    'text': 'Detalles usuario',
                    'attr':  {
                        'id': 'btn_detalles_usuario', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;

                            if(!usuarios_selected_id) {
                                alert('No hay usuario seleccionado');
                                return;
                            }

                            fetch('/api/usuarios/' + usuarios_selected_id)
                            .then(response => response.json())
                            .then(usuario => {
                                document.querySelector('#usuario_detalles_username').value = usuario.username;
                                document.querySelector('#usuario_detalles_nombres').value = usuario.fullname;
								document.querySelector('#usuario_detalles_cedula').value = usuario.cedula;
                                document.querySelector('#usuario_detalles_num_tlf').value = usuario.num_tlf;
                                document.querySelector('#usuario_detalles_email').value = usuario.email;
								document.querySelector('#usuario_detalles_rol').value = usuario.rol;

                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el usuario', 'error');
                            });

                            modal('#detallesUsuarioModal', 'show');
                        }
                },
                {
                    'name': 'btn_modificar_usuario',
                    'text': 'Modificar',
                    'attr':  {
                        'id': 'btn_modificar_usuario', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;

                            if(!usuarios_selected_id) {
                                alert('No hay usuario seleccionado');
                                return;
                            }

                            fetch('/api/usuarios/' + usuarios_selected_id)
                            .then(response => response.json())
                            .then(usuario => {
                                document.querySelector('#usuario_modificar_cedula').value = usuario.cedula;
                                document.querySelector('#usuario_modificar_username').value = usuario.username;
                                document.querySelector('#usuario_modificar_nombres').value = usuario.fullname;
                                document.querySelector('#usuario_modificar_num_tlf').value = usuario.num_tlf;
                                document.querySelector('#usuario_modificar_email').value = usuario.email;
								document.querySelector('#usuario_modificar_rol').value = usuario.rol;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el cliente', 'error');
                                console.log('Error buscar cliente: ' + error);
                            });

                            modal('#modificarUsuarioModal', 'show');
                        }
                },
                {
                    'name': 'btn_toggle_usuario',
                    'text': 'Eliminar',
                    'attr':  {
                        'id': 'btn_toggle_usuario', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            modal('#eliminarUsuarioModal', 'show');
                        }
                }
            ],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/usuarios',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar los usuarios', 'error');
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {
						let html = ``
						
						if(row.is_superuser){
							html = `
                            <input type="hidden" name="usuario_id" value="${row.id}">

                            <div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
                                <p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
                                    ${row.username}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.rol}
                                </p>
                            </div>
                        `;
						}
						else{
							html = `
                            <input type="hidden" name="usuario_id" value="${row.id}">

                            <div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
                                <p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
                                    ${row.shortname}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.cedula}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.num_tlf}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.email}
                                </p>
                            </div>
                        `;
						}
                        

                        return html;
                    }
                },
            ],
		});

		$('#tabla_usuarios tbody').off('click', 'tr').on('click', 'tr', function () {
            const usuarios_selected = document.querySelector('#usuarios_selected_id');
            const current_usuario = this.querySelector('input[name="usuario_id"]') ? this.querySelector('input[name="usuario_id"]').value : '';


            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                usuarios_selected.value = '';
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                usuarios_selected.value = current_usuario;
            }

            btn_disabled_value = (usuarios_selected.value == '');
    
            table.button('btn_detalles_usuario:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_modificar_usuario:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_toggle_usuario:name').nodes().attr('disabled', btn_disabled_value);
        });

        table.on('draw', function(data) {
            $('#tabla_usuarios tbody').addClass('flex flex-wrap');
            $('#tabla_usuarios tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
        });
	}else if(tipo === 'proveedores') {
        $("#tabla_proveedores thead").hide();
        table = $('#tabla_proveedores').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_proveedor',
                    'text': 'Detalles proveedor',
                    'attr':  {
                        'id': 'btn_detalles_proveedor', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;

                            if(!proveedores_selected_id) {
                                alert('No hay proveedores seleccionado');
                                return;
                            }

                            fetch('/api/proveedores/' + proveedores_selected_id)
                            .then(response => response.json())
                            .then(proveedor => {
                                document.querySelector('#proveedor_detalles_nombres').value = proveedor.fullname;
								document.querySelector('#proveedor_detalles_rif').value = proveedor.rif;
                                document.querySelector('#proveedor_detalles_num_tlf').value = proveedor.num_tlf;
                                document.querySelector('#proveedor_detalles_email').value = proveedor.email;
								document.querySelector('#proveedor_detalles_fecha_nacimiento').value = proveedor.fecha_nacimiento;
								document.querySelector('#proveedor_detalles_edad').value = proveedor.get_age;
								document.querySelector('#proveedor_detalles_direccion').value = proveedor.direccion;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el proveedor', 'error');
                                console.log('Error buscar proveedor: ' + error);
                            });

                            modal('#detallesProveedorModal', 'show');
                        }
                },
                {
                    'name': 'btn_modificar_proveedor',
                    'text': 'Modificar',
                    'attr':  {
                        'id': 'btn_modificar_proveedor', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;

                            if(!proveedores_selected_id) {
                                alert('No hay proveedores seleccionado');
                                return;
                            }

                            fetch('/api/proveedores/' + proveedores_selected_id)
                            .then(response => response.json())
                            .then(proveedor => {
                                document.querySelector('#proveedor_modificar_rif').value = proveedor.rif;
                                document.querySelector('#proveedor_modificar_nombres').value = proveedor.fullname;
                                document.querySelector('#proveedor_modificar_num_tlf').value = proveedor.num_tlf;
                                document.querySelector('#proveedor_modificar_email').value = proveedor.email;
								document.querySelector('#proveedor_modificar_fecha_nacimiento').value = proveedor.fecha_nacimiento;
								document.querySelector('#proveedor_modificar_direccion').value = proveedor.direccion;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el proveedor', 'error');
                                console.log('Error buscar proveedor: ' + error);
                            });

                            modal('#modificarProveedorModal', 'show');
                        }
                },
                {
                    'name': 'btn_toggle_proveedor',
                    'text': 'Eliminar',
                    'attr':  {
                        'id': 'btn_toggle_proveedor', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            modal('#eliminarProveedorModal', 'show');
                        }
                }
            ],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/proveedores',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar los proveedoress', 'error');
					console.log('Error buscar proveedoress: ' + thrownError);
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {
						
						html = `
							<input type="hidden" name="proveedor_id" value="${row.id}">

							<div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
								<p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
									${row.shortname}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.rif}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.num_tlf}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.email}
								</p>
							</div>
						`;
						
                        return html;
                    }
                },
            ],
		});

		$('#tabla_proveedores tbody').off('click', 'tr').on('click', 'tr', function () {
            const proveedores_selected = document.querySelector('#proveedores_selected_id');
            const current_proveedor = this.querySelector('input[name="proveedor_id"]') ? this.querySelector('input[name="proveedor_id"]').value : '';


            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                proveedores_selected.value = '';
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                proveedores_selected.value = current_proveedor;
            }

            btn_disabled_value = (proveedores_selected.value == '');
    
            table.button('btn_detalles_proveedor:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_modificar_proveedor:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_toggle_proveedor:name').nodes().attr('disabled', btn_disabled_value);
        });

        table.on('draw', function(data) {
            $('#tabla_proveedores tbody').addClass('flex flex-wrap');
            $('#tabla_proveedores tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
        });
    } else if(tipo === 'productos') {
		$("#tabla_productos thead").hide();

        table = $('#tabla_productos').DataTable({
            'dom': 'Bfrtip',
			'buttons': [
				{
					'name': 'btn_detalles_producto',
					'text': 'Detalles producto',
					'attr':  {
						'id': 'btn_detalles_producto', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								alert('No hay producto seleccionado');
								return;
							}

							fetch('/api/productos/' + productos_selected_id)
							.then(response => response.json())
							.then(producto => {
								$('#container_producto_detalles_caucho').hide();
								$('#container_producto_detalles_rin').hide();

								document.querySelector('#producto_detalles_nombre').value = producto.nombre;
								document.querySelector('#producto_detalles_descripcion').value = producto.descripcion;
								document.querySelector('#producto_detalles_cantidad').value = producto.cantidad;
								document.querySelector('#producto_detalles_precio').value = producto.precio;

								if(producto.producto_type == '2') {
									document.querySelector('#producto_detalles_caucho_marca').value = producto.extra.marca;
									document.querySelector('#producto_detalles_caucho_medidas').value = producto.extra.medidas;
									document.querySelector('#producto_detalles_caucho_calidad').value = producto.extra.calidad;
									document.querySelector('#producto_detalles_caucho_fabricacion').value = producto.extra.fecha_fabricacion;

									$('#container_producto_detalles_caucho').show();
								}

								if(producto.producto_type == '3') {
									document.querySelector('#producto_detalles_rin_marca').value = producto.extra.marca;
									document.querySelector('#producto_detalles_rin_material').value = producto.extra.material;
									document.querySelector('#producto_detalles_rin_tamano').value = producto.extra.tamano;
									document.querySelector('#producto_detalles_rin_fabricacion').value = producto.extra.fecha_fabricacion;

									$('#container_producto_detalles_rin').show();
								}

							})
							.catch(function(error) {
								console.log('Error buscar cliente: ' + error);
							});

							modal('#detallesProductoModal', 'show');
						}
				},
				{
					'name': 'btn_modificar_producto',
					'text': 'Modificar',
					'attr':  {
						'id': 'btn_modificar_producto', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								alert('No hay producto seleccionado');
								return;
							}

							fetch('/api/productos/' + productos_selected_id)
							.then(response => response.json())
							.then(producto => {
								$('#container_producto_modificar_caucho').hide();
								$('#container_producto_modificar_rin').hide();

								document.querySelector('#producto_modificar_nombre').value = producto.nombre;
								document.querySelector('#producto_modificar_descripcion').value = producto.descripcion;
								document.querySelector('#producto_modificar_precio').value = producto.precio;

								document.querySelector('#producto_modificar_tipo').value = producto.producto_type;

								if(producto.producto_type == '2') {
									document.querySelector('#producto_modificar_caucho_marca').value = producto.extra.marca;
									document.querySelector('#producto_modificar_caucho_medidas').value = producto.extra.medidas;
									document.querySelector('#producto_modificar_caucho_calidad').value = producto.extra.calidad;
									document.querySelector('#producto_modificar_caucho_fabricacion').value = producto.extra.fecha_fabricacion;

									$('#container_producto_modificar_caucho').show();
								}

								if(producto.producto_type == '3') {
									document.querySelector('#producto_modificar_rin_marca').value = producto.extra.marca;
									document.querySelector('#producto_modificar_rin_material').value = producto.extra.material;
									document.querySelector('#producto_modificar_rin_tamano').value = producto.extra.tamano;
									document.querySelector('#producto_modificar_rin_fabricacion').value = producto.extra.fecha_fabricacion;

									$('#container_producto_modificar_rin').show();
								}

							})
							.catch(function(error) {
								console.log('Error buscar cliente: ' + error);
							});

							modal('#modificarProductoModal', 'show');
						}
				},
				{
					'name': 'btn_toggle_producto',
					'text': 'Eliminar',
					'attr':  {
						'id': 'btn_toggle_producto', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							alert('asd');
						}
				},
				{
					'name': 'btn_cantidad_producto',
					'text': 'Sumar/Restar cantidad',
					'attr':  {
						'id': 'btn_cantidad_producto', 
						'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								alert('No hay producto seleccionado');
								return;
							}

							modal('#cantidadProductoModal', 'show');
						}
				}
			],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
            'language': { 'url': '/media/datatables-languages/es-ES_custom.json' },
            'ajax': {
                'url': '/api/productos',
                'type': 'GET',
                'dataSrc': '',
                'error': function (jqXHR, ajaxOptions, thrownError) {
                    bootstrapAlert('Ha ocurrido un error al cargar la lista de productos', 'error');
                    console.log('Error buscar productos: ' + thrownError);
                }
            },
            'columns': [
                {
                    render: function (data, type, row, meta) {
                        const html = `
                        	<input type="hidden" name="producto_id" value="${row.id}">

							<div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
								<p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
									${row.nombre}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Cantidad: ${row.cantidad}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Precio: ${row.precio}
								</p>
							</div>
                        `;

                        return html;
                    }
                },
            ],
        });

		$('#tabla_productos tbody').off('click', 'tr').on('click', 'tr', function () {
			const productos_selected = document.querySelector('#productos_selected_id');
			const current_producto = this.querySelector('input[name="producto_id"]') ? this.querySelector('input[name="producto_id"]').value : '';

			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				productos_selected.value = '';
			} else {
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				productos_selected.value = current_producto;
			}

			btn_disabled_value = (productos_selected.value == '');
	
			table.button('btn_detalles_producto:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_modificar_producto:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_toggle_producto:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_cantidad_producto:name').nodes().attr('disabled', btn_disabled_value);
		});

		table.on('draw', function(data) {
			$('#tabla_productos tbody').addClass('flex flex-wrap');
			$('#tabla_productos tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
		});

    } else if(tipo === 'ventas') {
        $("#tabla_ventas thead").hide();
        table = $('#tabla_ventas').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_venta',
                    'text': 'Detalles Venta',
                    'attr':  {
                        'id': 'btn_detalles_venta', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            venta_selected_id = document.querySelector('#venta_selected_id').value;

                            if(!venta_selected_id) {
                                alert('No ha seleccionado ninguna venta');
                                return;
                            }

                            fetch('/api/ventas/' + venta_selected_id)
                            .then(response => response.json())
                            .then(venta => {
                                const cliente = venta.cliente[0];
								document.querySelector('#venta_detalles_nroVenta').value = venta.id;
								document.querySelector('#venta_detalles_fecha').value = venta.fecha;
								document.querySelector('#venta_detalles_total').value = venta.total;
								document.querySelector('#venta_detalles_cedula').value = cliente.cedula;
								document.querySelector('#venta_detalles_nombres').value = cliente.shortname;

								const contenedor = document.getElementById('productos_informacion');
								contenedor.innerHTML = '';
								const productos = venta.productos[0];
								var contador = 0;
								productos.forEach((producto) => {

									const titulo = document.createElement('h3');
									titulo.textContent = 'Productos Asociados';
									titulo.classList.add('servicios_titulo', 'text-lg', 'font-semibold', 'text-gray-600', 'dark:text-gray-300');
									contenedor.appendChild(titulo);

									const contenedor_labels = document.createElement('div')
									contenedor_labels.classList.add('contenedor_labels')
									contenedor.appendChild(contenedor_labels);

									generar_div("Nombre", producto.nombre, contenedor_labels)
									generar_div("Precio", producto.precio, contenedor_labels)
									generar_div("Descripcion", producto.descripcion, contenedor_labels)
									if (producto.extra.marca !== undefined) generar_div("Marca", producto.extra.marca, contenedor_labels);

									generar_div("Cantidad Solicitada", venta.cantidad[0][venta.detalles[0][contador].id], contenedor_labels);
									contador++;
									
									if(producto.extra.producto_type == 2){
										generar_div("Medidas", producto.extra.medidas, contenedor_labels)
										generar_div("Calidad", producto.extra.calidad, contenedor_labels)
									}else if(producto.extra.producto_type == 3){
										generar_div("Vizcocidad", producto.extra.vizcosidad, contenedor_labels)
										generar_div("Tipo", producto.extra.tipo, contenedor_labels)
									}

								});
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar la venta', 'error');
                            });

                            modal('#detallesVentaModal', 'show');
                        }
                },
            ],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/ventas',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar las ventas', 'error');
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {

						html = `
                            <input type="hidden" name="venta_id" value="${row.id}">

                            <div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
                                <p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
                                    Nro de Venta:${row.id}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.fecha}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.cliente[0].shortname}
                                </p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.cliente[0].cedula}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
                                    Total: ${row.total}
                                </p>
                            </div>
                        `;
                        

                        return html;
                    }
                },
            ],
		});

		$('#tabla_ventas tbody').off('click', 'tr').on('click', 'tr', function () {
            const venta_selected = document.querySelector('#venta_selected_id');
            const current_venta = this.querySelector('input[name="venta_id"]') ? this.querySelector('input[name="venta_id"]').value : '';


            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                venta_selected.value = '';
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                venta_selected.value = current_venta;
            }

            btn_disabled_value = (venta_selected.value == '');
    
            table.button('btn_detalles_venta:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_modificar_venta:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_toggle_venta:name').nodes().attr('disabled', btn_disabled_value);
        });

        table.on('draw', function(data) {
            $('#tabla_ventas tbody').addClass('flex flex-wrap');
            $('#tabla_ventas tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
        });
    } else if(tipo === 'transacciones') {
		$("#tabla_transacciones thead").hide();
        table = $('#tabla_transacciones').DataTable({
			'dom': 'Bfrtip',
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/transacciones',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar inventario', 'danger');
					console.log('Error buscar productos: ' + thrownError);
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {

						html = `
                            <input type="hidden" name="transaccion_id" value="${row.id}">

                            <div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
								<p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
									Id: ${row.id}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Acción: ${row.accion}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Producto: ${row.producto[0].nombre}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Cliente: ${row.cliente[0]}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Usuario: ${row.usuario[0]}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Cantidad: ${row.cantidad}
								</p>
                            </div>
                        `;
                        
                        return html;
                    }
                },
            ],
		});

		
    }else if(tipo === 'servicios') {
        $("#tabla_servicios thead").hide();
        table = $('#tabla_servicios').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_servicio',
                    'text': 'Detalles servicio',
                    'attr':  {
                        'id': 'btn_detalles_servicio', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            servicios_selected_id = document.querySelector('#servicios_selected_id').value;

                            if(!servicios_selected_id) {
                                alert('No hay servicios seleccionado');
                                return;
                            }

                            fetch('/api/servicios/' + servicios_selected_id)
                            .then(response => response.json())
                            .then(servicio => {
                                document.querySelector('#servicio_detalles_codigo').value = servicio.codigo;
								document.querySelector('#servicio_detalles_nombre').value = servicio.nombre;
                                document.querySelector('#servicio_detalles_precio').value = servicio.precio;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el servicio', 'error');
                                console.log('Error buscar servicio: ' + error);
                            });

                            modal('#detallesServicioModal', 'show');
                        }
                },
                {
                    'name': 'btn_modificar_servicio',
                    'text': 'Modificar',
                    'attr':  {
                        'id': 'btn_modificar_servicio', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            servicios_selected_id = document.querySelector('#servicios_selected_id').value;

                            if(!servicios_selected_id) {
                                alert('No hay servicio seleccionado');
                                return;
                            }

                            fetch('/api/servicios/' + servicios_selected_id)
                            .then(response => response.json())
                            .then(servicio => {
                                document.querySelector('#servicio_modificar_codigo').value = servicio.codigo;
                                document.querySelector('#servicio_modificar_nombre').value = servicio.nombre;
                                document.querySelector('#servicio_modificar_precio').value = servicio.precio;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el servicio', 'error');
                                console.log('Error buscar servicio: ' + error);
                            });

                            modal('#modificarServicioModal', 'show');
                        }
                },
                {
                    'name': 'btn_toggle_servicio',
                    'text': 'Eliminar',
                    'attr':  {
                        'id': 'btn_toggle_servicio', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            modal('#eliminarServicioModal', 'show');
                        }
                }
            ],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/servicios',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar los servicios', 'error');
					console.log('Error buscar servicios: ' + thrownError);
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {
						
						html = `
							<input type="hidden" name="servicio_id" value="${row.id}">

							<div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
								<p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
									Codigo: ${row.codigo}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.nombre}
								</p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									${row.precio}
								</p>
							</div>
						`;
						
                        return html;
                    }
                },
            ],
		});

		$('#tabla_servicios tbody').off('click', 'tr').on('click', 'tr', function () {
            const servicios_selected = document.querySelector('#servicios_selected_id');
            const current_servicio = this.querySelector('input[name="servicio_id"]') ? this.querySelector('input[name="servicio_id"]').value : '';


            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                servicios_selected.value = '';
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                servicios_selected.value = current_servicio;
            }

            btn_disabled_value = (servicios_selected.value == '');
    
            table.button('btn_detalles_servicio:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_modificar_servicio:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_toggle_servicio:name').nodes().attr('disabled', btn_disabled_value);
        });

        table.on('draw', function(data) {
            $('#tabla_servicios tbody').addClass('flex flex-wrap');
            $('#tabla_servicios tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
        });

	}else if(tipo === 'servicio-facturado') {
		$("#tabla_servicios_facturados thead").hide();
        table = $('#tabla_servicios_facturados').DataTable({
			'dom': 'Bfrtip',
            'buttons': [
                {
                    'name': 'btn_detalles_servicios_facturados',
                    'text': 'Detalles servicios facturados',
                    'attr':  {
                        'id': 'btn_detalles_servicios_facturados', 
                        'class': 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            servicios_facturados_selected_id = document.querySelector('#servicios_facturados_selected_id').value;

                            if(!servicios_facturados_selected_id) {
                                alert('No hay servicios facturados seleccionado');
                                return;
                            }

                            fetch('/api/servicio-facturado/' + servicios_facturados_selected_id)
                            .then(response => response.json())
                            .then(servicio_facturado => {

                                document.querySelector('#servicio_facturado_detalles_cedula').value = servicio_facturado.cliente.cedula;
                                document.querySelector('#servicio_facturado_detalles_fullname').value = servicio_facturado.cliente.fullname;
                                document.querySelector('#servicio_facturado_detalles_num_tlfno').value = servicio_facturado.cliente.num_tlf;
                                document.querySelector('#servicio_facturado_detalles_precio').value = servicio_facturado.precio;


								const contenedor = document.getElementById('servicios_informacion');
								contenedor.innerHTML = '';
								const serviciosFacturado = servicio_facturado.servicios;
								serviciosFacturado.forEach((servicioFacturado) => {

									const titulo = document.createElement('h4');
									titulo.textContent = 'Servicios Asociados';
									titulo.classList.add('servicios_titulo', 'text-lg', 'font-semibold', 'text-gray-600', 'dark:text-gray-300');
									contenedor.appendChild(titulo);

									const contenedor_labels = document.createElement('div')
									contenedor_labels.classList.add('contenedor_labels')
									contenedor.appendChild(contenedor_labels);

									generar_div("Código", servicioFacturado.codigo, contenedor_labels)
									generar_div("Nombre", servicioFacturado.nombre, contenedor_labels)
									generar_div("Precio", servicioFacturado.precio, contenedor_labels)

								});
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el servicio', 'error');
                                console.log('Error buscar servicio: ' + error);
                            });

                            modal('#detallesServiciosFacturadosModal', 'show');
                        }
                },
			],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
			'language': {'url': '/media/datatables-languages/es-ES_default.json'},
			'ajax': {
				'url': '/api/servicio-facturado/',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar los servicios', 'danger');
				 }
			},
			'columns': [
                {
                    render: function (data, type, row, meta) {
                        html = `
                            <input type="hidden" name="servicios_facturados_id" value="${row.id}">

                            <div class="flex flex-col p-4 bg-purple-600 rounded-lg shadow-xl dark:bg-purple-600">
                                <p class="mb-2 text-xl font-bold text-gray-300 dark:text-gray-300">
                                    ${row.cliente.cedula}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.cliente.fullname}
                                </p>
                                <p class="text-lg text-gray-200 dark:text-gray-200">
                                    ${row.cliente.num_tlf}
                                </p>
								<p class="text-lg text-gray-200 dark:text-gray-200">
									Monto: ${row.precio}
								</p>
                            </div>
                        `;
                        
                        return html;
                    }
                },
            ],
		});

		$('#tabla_servicios_facturados tbody').off('click', 'tr').on('click', 'tr', function () {
            const servicios_facturados_selected = document.querySelector('#servicios_facturados_selected_id');
            const current_servicio_facturado = this.querySelector('input[name="servicios_facturados_id"]') ? this.querySelector('input[name="servicios_facturados_id"]').value : '';


            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                servicios_facturados_selected.value = '';
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                servicios_facturados_selected.value = current_servicio_facturado;
            }

            btn_disabled_value = (servicios_facturados_selected.value == '');
    
            table.button('btn_detalles_servicios_facturados:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_modificar_servicios_facturados:name').nodes().attr('disabled', btn_disabled_value);
            table.button('btn_toggle_servicios_facturados:name').nodes().attr('disabled', btn_disabled_value);
        });

        table.on('draw', function(data) {
            $('#tabla_servicios_facturados tbody').addClass('flex flex-wrap');
            $('#tabla_servicios_facturados tbody tr').addClass('lg:w-1/4 md:w-1/3 sm:w-full');
        });
	}
}

function productos_get_table_data(table_id) {
    let all_data_table = [];

    $('#' + table_id + ' tbody tr').each(function(index) {
        const producto_id = this.children[1].querySelector('.selectpicker').value;
        const cantidad = this.children[2].children[0].value;
        const monto = this.children[3].children[0].value;

        if (producto_id) {
            let current = {
                producto_id: producto_id,
                cantidad: cantidad,
                monto: monto
            };
            all_data_table.push(current);
        }
    });

    return all_data_table;
}

function servicios_get_table_data(table_id) {
    let all_data_table = [];

    $('#' + table_id + ' tbody tr').each(function(index) {
        const servicio_id = this.children[1].querySelector('.selectpicker').value;
        const monto = this.children[2].children[0].value;


        if (servicio_id) {
            let current = {
                codigo: servicio_id,
                monto: monto,
            };
            all_data_table.push(current);
        }
    });

    return all_data_table;
}

function productos_add_table_row(table_id) {
	const count = $('#' + table_id + ' tbody tr').length;
	const select_options = document.querySelector('#product_options').innerHTML;

	$('#' + table_id).find('tbody').append(
		`<tr>
			<td scope="row">${count+1}</td>
			<td>
				<select class="form-control selectpicker" data-live-search="true">${select_options}</select>
			</td>
			<td><input type="number" class="form-control input_cantidad" step="1" min="1" value="1" oninput="validity.valid||(value='');"></td>
			<td>
				<input type="number" class="form-control input_precio" step=".01" value="0.00" readonly>
				<input type="hidden" class="input_precio_original" readonly>
			</td>
			<td><button type="button" class="btn btn-danger btn-sm" onclick="delete_row(this)"><i class="fa fa-trash"></i></button></td>
		</tr>`
	);

	$('.selectpicker').selectpicker();
}

function servicios_add_table_row(table_id) {
	const count = $('#' + table_id + ' tbody tr').length;
	const select_options = document.querySelector('#services_options').innerHTML;

	$('#' + table_id).find('tbody').append(
		`<tr>
			<td scope="row">${count+1}</td>
			<td>
				<select class="form-control selectpicker" data-live-search="true">${select_options}</select>
			</td>
			<td>
				<input type="number" class="form-control input_precio" step=".01" value="0.00" readonly>
				<input type="hidden" class="input_precio_original" readonly>
			</td>
			<td><button type="button" class="btn btn-danger btn-sm" onclick="delete_row(this)"><i class="fa fa-trash"></i></button></td>
		</tr>`
	);



	$('.selectpicker').selectpicker();
}

function productos_load_table_data(table_id, data) {
	if(data) {
		$('#' + table_id + ' tbody tr').remove();

		$.each(data.split('//'), function( index, value ) {
			if(value) {
				value_split = value.split(';;');

				$('#' + table_id).find('tbody').append(
					`<tr>
						<td scope="row">${index+1}</td>
						<td><input type="text" class="form-control" value="${value_split[0]}"></td>
						<td><input type="number" class="form-control" step=".01" value="${value_split[1]}"></td>
						<td><button type="button" class="btn btn-danger btn-sm" onclick="delete_row(this)"><i class="bi bi-x-circle"></i></button></td>
					</tr>`
				);
			}
		});
	} else {
		producto_reset_table(table_id);
	}
}

function producto_reset_table(table_id) {
	$('#' + table_id + ' tbody tr').remove();
	productos_add_table_row(table_id);
}

function servicio_reset_table(table_id) {
	$('#' + table_id + ' tbody tr').remove();
	servicios_add_table_row(table_id);

}

function delete_row(btn) {
	btn.parentElement.parentElement.remove();
}

function reset_modal_agregar(form_id){
	$(form_id).get(0).reset();
}

function validarCorreo(id) {
	var correo = document.getElementById(id).value;
	var patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
	if (!patronCorreo.test(correo)) {
	  document.getElementById('mensaje_error_' + id).innerText = 'Correo electrónico no válido';
	} else {
	  document.getElementById('mensaje_error_' + id).innerText = '';
	}
}

function bootstrapAlert(message, type) {

	var alertClass = '';

    switch (type) {
        case 'info':
            alertClass = 'info';
            break;
        case 'error':
            alertClass = 'error';
            break;
        case 'success':
            alertClass = 'success';
            break;
        default:
            alertClass = 'info';
            break;
    }

	$.bootstrapGrowl(message, {
		
		ele: 'body', // which element to append to
		type: alertClass, // (null, 'info', 'error', 'success')
		offset: {from: 'bottom', amount: 30}, // 'top', or 'bottom'
		align: 'center', // ('left', 'right', or 'center')
		width: 800, // (integer, or 'auto')
		delay: 3000,
		allow_dismiss: true,
		stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

// $('.btn-detalles').on('click', function () {
// 	var venta_id = $(this).data('venta-id');

// 	if(venta_id) {
// 		fetch('/api/ventas/' + venta_id)
// 		.then(response => response.json())
// 		.then(venta => {
// 			const cliente = venta.cliente[0];
// 			document.querySelector('#venta_detalles_nroVenta').value = venta.id;
// 			document.querySelector('#venta_detalles_fecha').value = venta.fecha;
// 			document.querySelector('#venta_detalles_total').value = venta.total;
// 			document.querySelector('#cliente_detalles_cedula').value = cliente.cedula;
// 			document.querySelector('#cliente_detalles_num_tlf').value = cliente.num_tlf;
// 			document.querySelector('#cliente_detalles_nombres').value = cliente.names;

// 			const contenedor = document.getElementById('productos_informacion');
// 			contenedor.innerHTML = '';
// 			const productos = venta.productos[0];
// 			var contador = 0;
// 			productos.forEach((producto) => {
// 				console.log(venta.cantidad[0][venta.detalles[0][contador].id]);

// 				const titulo = document.createElement('h3');
// 				titulo.textContent = producto.nombre;
// 				const div_titulo = document.createElement('div');
// 				div_titulo.classList.add('col-md-12', 'mb-3');
// 				div_titulo.appendChild(titulo);
// 				contenedor.appendChild(div_titulo);

// 				generar_div("Nombre", producto.nombre, contenedor)
// 				generar_div("Precio", producto.precio, contenedor)
// 				generar_div("Descripcion", producto.descripcion, contenedor)
// 				if (producto.extra.marca !== undefined) generar_div("Marca", producto.extra.marca, contenedor);
				
// 				generar_div("Cantidad Solicitada", venta.cantidad[0][venta.detalles[0][contador].id], contenedor);
// 				contador++;

// 				if(producto.extra.producto_type == 2){
// 					generar_div("Medidas", producto.extra.medidas, contenedor)
// 					generar_div("Calidad", producto.extra.calidad, contenedor)
// 				}else if(producto.extra.producto_type == 3){
// 					generar_div("Vizcocidad", producto.extra.vizcosidad, contenedor)
// 					generar_div("Tipo", producto.extra.tipo, contenedor)
// 				}

// 			});
// 		})
// 		.catch(function(error) {
// 			bootstrapAlert('Ha ocurrido un error al buscar el cliente', 'error');
// 			console.log('Error buscar cliente: ' + error);
// 		});

// 		$('#detallesVentaModal').modal('show');
// 	} else {
// 		bootstrapAlert('No se ha seleccionado ningún cliente', 'info');
// 	}
// });