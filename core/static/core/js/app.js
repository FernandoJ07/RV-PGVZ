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
		    		bootstrapAlert('Registro del cliente realizado satisfactoriamente.', 'success');
					modal('#agregarClienteModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);

				} else if(result.error == 'No permission.') {
					modal('#agregarClienteModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar registros de clientes.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarClienteModal', 'hide');
		    		bootstrapAlert('El cliente no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Hay un cliente registrado con este número de cédula de identidad.', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al registrar la información del cliente.', 'error');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al registrar la información del cliente.', 'error');
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
		    		bootstrapAlert('Actualización de la información del cliente realizada satifastoriamente.', 'success');
		    		modal('#modificarClienteModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarClienteModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los clientes.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarClienteModal', 'hide');
		    		bootstrapAlert('El cliente no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Hay un cliente registrado con este número de cédula de identidad.', 'error');

		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');
		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al actualizar la información del cliente.');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al actualizar la información del cliente.', 'error');
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
		    		bootstrapAlert('Información del cliente eliminada satisfactoriamente.', 'success');

		    		setTimeout(() => {
						fill_table('clientes');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarClienteModal', 'hide');
		    		bootstrapAlert('El cliente no se encuentra registrado en el sistema.', 'error');

		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarClienteModal', 'hide');
		    		bootstrapAlert('Los privilegios de tu cuenta no permiten eliminar la información de los clientes.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al eliminar la información del cliente.');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al eliminar la información del cliente.', 'error');
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
					bootstrapAlert('Registro del proveedor realizado satisfactoriamente.', 'success');
					modal('#agregarProveedorModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('proveedores');
		    		}, 100);

				} else if(result.error == 'No permission.') {
					modal('#agregarProveedorModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar registros de proveedores.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarProveedorModal', 'hide');
		    		bootstrapAlert('El proveedor no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Hay un proveedor registrado con este número de cédula de identidad.', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al registrar la información del proveedor.', 'error');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al registrar la información del proveedor.', 'error');
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
		    		bootstrapAlert('Actualización de la información del proveedor realizada satifastoriamente.', 'success');
		    		modal('#modificarProveedorModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('proveedores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarProveedorModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los proveedores.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarProveedorModal', 'hide');
		    		bootstrapAlert('El proveedor no se encuentra registrado en el sistema.', 'error');
					
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Hay un proveedor registrado con este número de cédula de identidad.', 'error');

		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al actualizar la información del proveedor');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al actualizar la información del proveedor');
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
		    		bootstrapAlert('Información del proveedor eliminada satisfactoriamente.', 'success');

		    		setTimeout(() => {
						fill_table('proveedores');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarProveedorModal', 'hide');
		    		bootstrapAlert('El proveedor no se encuentra registrado en el sistema.', 'error');
		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarProveedorModal', 'hide');
		    		bootstrapAlert('Los privilegios de tu cuenta no permiten eliminar la información de los proveedores.', 'error');
					
		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al eliminar la información del proveedor.');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al eliminar la información del proveedor.');
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
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar registros de usuarios.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarUsuarioModal', 'hide');
		    		bootstrapAlert('El usuario no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Ya existe usuario registrado con esta cedula', 'error');
					
		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al registrar la información del usuario.', 'error');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al registrar la información del usuario.', 'error');
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
		    		bootstrapAlert('Actualización de la información del usuario realizada satifastoriamente.', 'success');
		    		modal('#modificarUsuarioModal', 'hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('usuarios');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarUsuarioModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los usuarios.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarUsuarioModal', 'hide');
		    		bootstrapAlert('El usuario no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'CedulaNotUnique.') {
		    		bootstrapAlert('Hay un usuario registrado con este número de cédula de identidad.', 'error');

		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al actualizar la información del usuario');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al actualizar la información del usuario');
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

		const proveedor_options = document.getElementById('producto_agregar_proveedor');

			fetch('/api/proveedores')
			.then(response => response.json())
			.then(data => {
				data.forEach(proveedor => {
					console.log(proveedor)
					var opt = document.createElement('option');
					opt.value = proveedor.id;
					opt.innerHTML = proveedor.shortname;
					proveedor_options.appendChild(opt);
				});

			})
		.catch(function(error) {console.log('Error buscar proveeedores: ' + error);});
		
		

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
		    		bootstrapAlert('Registro del producto realizado satisfactoriamente.', 'success');
					modal('#agregarProductoModal', 'hide');
		    		this.reset();

					document.querySelector('#container_producto_agregar_caucho').style.display = 'none';
					document.querySelector('#container_producto_agregar_rin').style.display = 'none';

		    		setTimeout(() => {
		    			fill_table('productos');
		    		}, 100);
					
				} else if(result.error == 'No permission.') {
					modal('#agregarProductoModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar registros de productos.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
					modal('#agregarProductoModal', 'hide');
		    		bootstrapAlert('El producto no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al registrar la información del producto.', 'error');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al registrar la información del producto.', 'error');
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
					bootstrapAlert('Actualización de la información del producto realizada satifastoriamente.', 'success');
		    		modal('#modificarProductoModal', 'hide');
		    		this.reset();

					document.querySelector('#container_producto_modificar_caucho').style.display = 'none';
					document.querySelector('#container_producto_modificar_rin').style.display = 'none';

		    		setTimeout(() => {
		    			fill_table('productos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					modal('#modificarProductoModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los productos.', 'error');

		    	} else if(result.error == 'DoesNotExist.') {
		    		modal('#modificarProductoModal', 'hide');
		    		bootstrapAlert('El producto no se encuentra registrado en el sistema.', 'error');

		    	} else if(result.error == 'ValueError.') {
		    		bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
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
					bootstrapAlert('La cantidad de producto se ha añadido satifastoriamente.', 'success');
					modal('#cantidadProductoModal', 'hide');
					document.querySelector('#producto_cantidad_valor').value = 0;

					setTimeout(() => {
						fill_table('productos');
					}, 100);
				} else if(result.error == 'No permission.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los productos.', 'error');

				} else if(result.error == 'DoesNotExist.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('El producto no se encuentra registrado en el sistema.', 'error');

				} else if(result.error == 'ValueError.') {
					bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

				} else {
					bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
				}
			})
			.catch(function(error) {
				bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
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
					bootstrapAlert('La cantidad de producto se ha reducido satisfactoriamente.', 'success');
					modal('#cantidadProductoModal', 'hide');
					document.querySelector('#producto_cantidad_valor').value = 0;

					setTimeout(() => {
						fill_table('productos');
					}, 100);
				} else if(result.error == 'No permission.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('Los privilegios de tu cuenta no permiten realizar cambios en la información de los productos.', 'error');

				} else if(result.error == 'DoesNotExist.') {
					modal('#cantidadProductoModal', 'hide');
					bootstrapAlert('El producto no se encuentra registrado en el sistema.', 'error');

				} else if(result.error == 'ValueError.') {
					bootstrapAlert('Asegúrese de completar todos los campos de forma adecuada.', 'error');

				} else {
					bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
				}
			})
			.catch(function(error) {
				bootstrapAlert('Se ha producido un fallo al actualizar la información del producto.');
				console.log('Error: ' + error);
			});
		});

		// Eliminar producto
		$('#btn_producto_eliminar').on('click', function() {
			productos_selected_id = document.querySelector('#productos_selected_id').value;

			fetch('/api/productos/' + productos_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
					modal('#eliminarProductoModal', 'hide');
		    		bootstrapAlert('Información del producto eliminada satisfactoriamente.', 'success');

		    		setTimeout(() => {
						fill_table('productos');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
					modal('#eliminarProductoModal', 'hide');
		    		bootstrapAlert('El producto no se encuentra registrado en el sistema.', 'error');

		    	}
		    	else if(result.error == 'No permission.') {
					modal('#eliminarProductoModal', 'hide');
		    		bootstrapAlert('Los privilegios de tu cuenta no permiten eliminar la información de los productos.', 'error');

		    	} else {
		    		bootstrapAlert('Se ha producido un fallo al eliminar la información del producto.');
		    	}
		    })
		    .catch(function(error) {
		    	bootstrapAlert('Se ha producido un fallo al eliminar la información del producto.', 'error');
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
		$('#venta_agregar_productos tbody').off('change', '.select_producto');
		$('#venta_agregar_productos tbody').on('change', '.select_producto', function () {
			const precio = $("option[value=" + $(this).val() + "]", this).attr('data-precio');
			const cantidad = $("option[value=" + $(this).val() + "]", this).attr('data-cantidad');
			let tr = this.parentElement.parentElement.parentElement.parentElement.parentElement;
			
			tr.querySelector('.input_precio').value = precio;
			tr.querySelector('.input_precio_original').value = precio;
			tr.querySelector('.input_cantidad').value = 1;
			tr.querySelector('.input_cantidad').max = cantidad;
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
	
	if(window.location.pathname.split('/')[1] === 'facturas') {
		$('#btn_factura_modal_detalles').on('click', function() {
			$('#detallesFacturaModal').modal('show');
		});
	};

});

function fill_table(tipo) {
	if (tipo === 'clientes') {

        table = $('#tabla_clientes').DataTable({
            'dom': 'Bfrtip',
			'buttons': [
				{
					'name': 'btn_detalles_cliente',
					'text': 'Detalles cliente',
					'attr':  {
						'id': 'btn_detalles_cliente', 
						'class': 'btn_detail_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(!clientes_selected_id) {
								bootstrapAlert('Debe seleccionar un cliente.', 'warning');
								return;
							}

							fetch('/api/clientes/' + clientes_selected_id)
							.then(response => response.json())
							.then(cliente => {
								document.querySelector('#cliente_detalles_cedula').value = cliente.cedula;
								document.querySelector('#cliente_detalles_nombres').value = cliente.fullname;
								document.querySelector('#cliente_detalles_num_tlf').value = cliente.num_tlf;
								document.querySelector('#cliente_detalles_email').value = cliente.email;
								document.querySelector('#cliente_detalles_status').value = cliente.status;
								document.querySelector('#cliente_detalles_direccion').value = cliente.direccion;

							})
							.catch(function(error) {
								bootstrapAlert('Se ha producido un fallo buscando la información del cliente.', 'error');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#detallesClienteModal', 'show');
						}
				},
				{
					'name': 'btn_modificar_cliente',
					'text': 'Editar',
					'attr':  {
						'id': 'btn_modificar_cliente', 
						'class': 'btn_edit_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(!clientes_selected_id) {
								bootstrapAlert('Debe seleccionar un cliente.', 'warning');
								return;
							}

							fetch('/api/clientes/' + clientes_selected_id)
							.then(response => response.json())
							.then(cliente => {
								document.querySelector('#cliente_modificar_cedula').value = cliente.cedula;
								document.querySelector('#cliente_modificar_nombres').value = cliente.fullname;
								document.querySelector('#cliente_modificar_num_tlf').value = cliente.num_tlf;
								document.querySelector('#cliente_modificar_email').value = cliente.email;
								document.querySelector('#cliente_modificar_status').value = cliente.status;
								document.querySelector('#cliente_modificar_direccion').value = cliente.direccion;
							})
							.catch(function(error) {
								bootstrapAlert('Se ha producido un fallo buscando la información del cliente.', 'error');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#modificarClienteModal', 'show');
						}
				},
				// {
				// 	'name': 'btn_toggle_cliente',
				// 	'text': 'Deshabilitar',
				// 	'attr':  {
				// 		'id': 'btn_toggle_cliente', 
				// 		'class': 'btn_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
				// 		'disabled': true
				// 	},
				// 	'action':
				// 		function(e) {
				// 			modal('#eliminarClienteModal', 'show');
				// 		}
				// }
			],
			'select': true,
            'bInfo': false,
            'pageLength': 8,
            'destroy': true,
            'lengthChange': false,
            'deferRender': true,
            'language': { 'url': '/media/datatables-languages/es-ES_default.json' },
            'ajax': {
                'url': '/api/clientes',
                'type': 'GET',
                'dataSrc': '',
                'error': function (jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Se ha producido un fallo buscando la información del clientes.', 'error');
                    console.log('Error buscar clientes: ' + thrownError);
                }
            },
            'columns': [
                {"data": "id"},
				{"data": "shortname"},
                {"data": "cedula"},
                {"data": "num_tlf"},
                {"data": "email"},
                {"data": "status"},
            ],
			"columnDefs": [
				{className: 'hidden', searchable: false, targets: [ 0 ]},
				{className: "font-semibold text-gray-700 dark:text-gray-400", targets: 1},
				{className: "text-gray-700 dark:text-gray-400", targets: "_all"},
				{
					orderable: false,
					width: 110,
					render: function (data, type, row) {
						let status = ``

						switch (row.status){
							case "inactivo":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">
									${row.status}
									</span>
								`
								break
							case "deshabilitado":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
									${row.status}
									</span>
								`
								break
							default:
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
									${row.status}
									</span>
								`
								break
						}
						return status
					},
					'targets': [-1]
				},
			]
            
        });

		$('#tabla_clientes tbody').off('click', 'tr').on('click', 'tr', function () {
			const clientes_selected = document.querySelector('#clientes_selected_id');
			const current_cliente = this.children[0] ? this.children[0].innerText : '';

			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				clientes_selected.value = '';
			} else {
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				clientes_selected.value = current_cliente;
			}

			btn_disabled_value = (clientes_selected.value == '')
	
			table.button('btn_detalles_cliente:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_modificar_cliente:name').nodes().attr('disabled', btn_disabled_value);
			table.button('btn_toggle_cliente:name').nodes().attr('disabled', btn_disabled_value);

		});



	} else if(tipo === 'usuarios') {
        
		table = $('#tabla_usuarios').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_usuario',
                    'text': 'Detalles usuario',
                    'attr':  {
                        'id': 'btn_detalles_usuario', 
                        'class': 'btn_detail_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;

                            if(!usuarios_selected_id) {
                                bootstrapAlert('Debe seleccionar un usuario.', 'warning');
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
								document.querySelector('#usuario_detalles_status').value = usuario.status;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Ha ocurrido un error al buscar el usuario', 'error');
                            });

                            modal('#detallesUsuarioModal', 'show');
                        }
                },
                {
                    'name': 'btn_modificar_usuario',
                    'text': 'Editar',
                    'attr':  {
                        'id': 'btn_modificar_usuario', 
                        'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            usuarios_selected_id = document.querySelector('#usuarios_selected_id').value;

                            if(!usuarios_selected_id) {
                                bootstrapAlert('Debe seleccionar un usuario.', 'warning');
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
								document.querySelector('#usuario_modificar_rol').value = (usuario.rol === "Gerente de Ventas") ? "GerenteVentas" : usuario.rol;
								document.querySelector('#usuario_modificar_status').value = usuario.status;

                            })
                            .catch(function(error) {
                                bootstrapAlert('Se ha producido un fallo buscando la información del usuario.', 'error');
                                console.log('Error buscar cliente: ' + error);
                            });

                            modal('#modificarUsuarioModal', 'show');
                        }
                },
                // {
                //     'name': 'btn_toggle_usuario',
                //     'text': 'Deshabilitar',
                //     'attr':  {
                //         'id': 'btn_toggle_usuario', 
                //         'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                //         'disabled': true
                //     },
                //     'action':
                //         function(e) {
                //             modal('#eliminarUsuarioModal', 'show');
                //         }
                // }
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
				{"data": "id"},
                {"data": "shortname"},
                {"data": "cedula"},
                {"data": "num_tlf"},
                {"data": "email"},
                {"data": "rol"},
                {"data": "status"},
            ],
			"columnDefs": [
				{className: 'hidden', searchable: false, targets: [ 0 ]},
				{className: "font-semibold text-gray-700 dark:text-gray-400", targets: 0},
				{className: "text-gray-700 dark:text-gray-400", targets: "_all"},
				{
					orderable: false,
					width: 110,
					render: function (data, type, row) {
						let status = ``

						switch (row.status){

							case "inactivo":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">
									${row.status}
									</span>
								`
								break
							case "deshabilitado":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
									${row.status}
									</span>
								`
								break
							default:
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
									${row.status}
									</span>
								`
								break

						}
						return status
					},
					'targets': [-1]
				},
			]
		});

		$('#tabla_usuarios tbody').off('click', 'tr').on('click', 'tr', function () {
            const usuarios_selected = document.querySelector('#usuarios_selected_id');
            const current_usuario = this.children[0] ? this.children[0].innerText : '';


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

	} else if(tipo === 'proveedores') {

        table = $('#tabla_proveedores').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
                {
                    'name': 'btn_detalles_proveedor',
                    'text': 'Detalles proveedor',
                    'attr':  {
                        'id': 'btn_detalles_proveedor', 
                        'class': 'btn_detail_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;

                            if(!proveedores_selected_id) {
                                bootstrapAlert('Debe seleccionar un proveedor.', 'warning');
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
								document.querySelector('#proveedor_detalles_edad').value = proveedor.age;
								document.querySelector('#proveedor_detalles_status').value = proveedor.status;
								document.querySelector('#proveedor_detalles_direccion').value = proveedor.direccion;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Se ha producido un fallo buscando la información del proveedor.', 'error');
                                console.log('Error buscar proveedor: ' + error);
                            });

                            modal('#detallesProveedorModal', 'show');
                        }
                },
                {
                    'name': 'btn_modificar_proveedor',
                    'text': 'Editar',
                    'attr':  {
                        'id': 'btn_modificar_proveedor', 
                        'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                        'disabled': true
                    },
                    'action':
                        function(e) {
                            proveedores_selected_id = document.querySelector('#proveedores_selected_id').value;

                            if(!proveedores_selected_id) {
                                bootstrapAlert('Debe seleccionar un proveedor.', 'warning');
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
								document.querySelector('#proveedor_modificar_status').value = proveedor.status;
								document.querySelector('#proveedor_modificar_direccion').value = proveedor.direccion;
                            })
                            .catch(function(error) {
                                bootstrapAlert('Se ha producido un fallo buscando la información del proveedor.', 'error');
                                console.log('Error buscar proveedor: ' + error);
                            });

                            modal('#modificarProveedorModal', 'show');
                        }
                },
                // {
                //     'name': 'btn_toggle_proveedor',
                //     'text': 'Deshabilitar',
                //     'attr':  {
                //         'id': 'btn_toggle_proveedor', 
                //         'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
                //         'disabled': true
                //     },
                //     'action':
                //         function(e) {
                //             modal('#eliminarProveedorModal', 'show');
                //         }
                // }
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
					bootstrapAlert('Se ha producido un fallo buscando la información del proveedores.', 'error');
					console.log('Error buscar proveedoress: ' + thrownError);
				 }
			},
			'columns': [
				{"data": "id"},
                {"data": "shortname"},
                {"data": "rif"},
                {"data": "num_tlf"},
                {"data": "email"},
                {"data": "status"},
            ],
			"columnDefs": [
				{className: 'hidden', searchable: false, targets: [ 0 ]},
				{className: "font-semibold text-gray-700 dark:text-gray-400", targets: 0},
				{className: "text-gray-700 dark:text-gray-400", targets: "_all"},
				{
					orderable: false,
					width: 110,
					render: function (data, type, row) {
						let status = ``

						switch (row.status){
							case "inactivo":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">
									${row.status}
									</span>
								`
								break
							case "deshabilitado":
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
									${row.status}
									</span>
								`
								break
							default:
								status = `
									<span class="px-2 py-1 text-xs font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
									${row.status}
									</span>
								`
								break
						}
						return status
					},
					'targets': [-1]
				},
			]
		});

		$('#tabla_proveedores tbody').off('click', 'tr').on('click', 'tr', function () {
            const proveedores_selected = document.querySelector('#proveedores_selected_id');
            const current_proveedor = this.children[0] ? this.children[0].innerText : '';


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
    } else if(tipo === 'productos') {

        table = $('#tabla_productos').DataTable({
            'dom': 'Bfrtip',
			'buttons': [
				{
					'name': 'btn_detalles_producto',
					'text': 'Detalles producto',
					'attr':  {
						'id': 'btn_detalles_producto', 
						'class': 'btn_detail_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								bootstrapAlert('Debe seleccionar un producto.', 'warning');
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
								bootstrapAlert('Se ha producido un fallo buscando la información del producto.', 'error');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#detallesProductoModal', 'show');
						}
				},
				{
					'name': 'btn_modificar_producto',
					'text': 'Editar',
					'attr':  {
						'id': 'btn_modificar_producto', 
						'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								bootstrapAlert('Debe seleccionar un producto.', 'warning');
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
								bootstrapAlert('Se ha producido un fallo buscando la información del producto.', 'error');
								console.log('Error buscar cliente: ' + error);
							});

							modal('#modificarProductoModal', 'show');
						}
				},
				// {
				// 	'name': 'btn_toggle_producto',
				// 	'text': 'Deshabilitar',
				// 	'attr':  {
				// 		'id': 'btn_toggle_producto', 
				// 		'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
				// 		'disabled': true
				// 	},
				// 	'action':
				// 		function(e) {
				// 			modal('#eliminarProductoModal', 'show');
				// 		}
				// },
				{
					'name': 'btn_cantidad_producto',
					'text': 'Sumar/Restar cantidad',
					'attr':  {
						'id': 'btn_cantidad_producto', 
						'class': 'btn_edit_and_delete_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow', 
						'disabled': true
					},
					'action':
						function(e) {
							productos_selected_id = document.querySelector('#productos_selected_id').value;

							if(!productos_selected_id) {
								bootstrapAlert('Debe seleccionar un producto.', 'warning');
								return;
							}

							modal('#cantidadProductoModal', 'show');
						}
				},
				
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
                    bootstrapAlert('Se ha producido un fallo buscando la información de productos.', 'error');
                    console.log('Error buscar productos: ' + thrownError);
                }
            },
			'columns': [
                {"data": "id"},
                {"data": "nombre"},
                {"data": "cantidad"},
                {"data": "precio"},
            ],
			"columnDefs": [
				{className: 'hidden', searchable: false, targets: [ 0 ]},
				{className: "font-semibold text-gray-700 dark:text-gray-400", targets: 0},
				{className: "text-gray-700 dark:text-gray-400", targets: "_all"},
				{
					// El índice de la columna que quieres formatear (empezando desde 0)
					"targets": [2], 
					"render": function ( data, type, row ) {
						console.log(row)
						// Formatea el número usando la función Number.toLocaleString()
						return Number(row.cantidad).toLocaleString('es-ES');
					}
				},
				{
					// El índice de la columna que quieres formatear (empezando desde 0)
					"targets": [3], 
					"render": function ( data, type, row ) {
						// Formatea el número usando la función Number.toLocaleString()
						return `$ ${Number(row.precio).toLocaleString('es-ES')}`;
					}
				},
			],
        });

		$('#tabla_productos tbody').off('click', 'tr').on('click', 'tr', function () {
			const productos_selected = document.querySelector('#productos_selected_id');
			const current_producto = this.children[0] ? this.children[0].innerText : '';

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

    } else if (tipo === 'ventas') {

		var button_excel = [];
		const is_superuser = document.querySelector('#user_superuser').value
		if(is_superuser === "True"){
			var exportarButton = {
				'extend': 'excel',
				'text': 'Exportar', 
				'filename': function() {
					var date = new Date();
					var day = date.getDate();
					var month = date.getMonth() + 1;
					var year = date.getFullYear();
					return 'Resumen de venta ' + year + '-' + month + '-' + day;
				},
				'attr': {
					'class': 'text-white font-semibold py-2 px-4 rounded shadow',
					'style': 'background-color:#167f47'
				},
			};

			button_excel.push(exportarButton);
		}
		table = $('#tabla_ventas').DataTable({
			'dom': 'Bfrtip',
			'buttons': [
				{
					'name': 'btn_detalles_venta',
					'text': 'Detalles Venta',
					'attr': {
						'id': 'btn_detalles_venta',
						'class': 'btn_detail_color bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow',
						'disabled': true
					},
					'action': function (e) {
						venta_selected_id = document.querySelector('#venta_selected_id').value;
	
						if (!venta_selected_id) {
							alert('No ha seleccionado ninguna venta');
							return;
						}
	
						fetch('/api/ventas/' + venta_selected_id)
							.then(response => response.json())
							.then(venta => {
								const cliente = venta.cliente[0];
								const vendedor = venta.vendedor[0];
	
								document.querySelector('#venta_detalles_nroVenta').value = venta.nroVenta;
								document.querySelector('#venta_detalles_vendedor').value = vendedor.shortname;
								document.querySelector('#venta_detalles_fecha').value = venta.fecha;
								document.querySelector('#venta_detalles_total').value = Number(venta.total).toLocaleString('es-ES');
								document.querySelector('#venta_detalles_cedula').value = cliente.cedula;
								document.querySelector('#venta_detalles_nombres').value = cliente.shortname;
	
								const contenedor = document.getElementById('productos_informacion');
								contenedor.innerHTML = '';
								const productos = venta.productos[0];
								var contador = 0;
	
								const titulo = document.createElement('h3');
								titulo.textContent = 'Productos Asociados';
								titulo.classList.add('servicios_titulo', 'text-lg', 'font-semibold', 'text-gray-600', 'dark:text-gray-300');
								contenedor.appendChild(titulo);
	
								productos.forEach((producto) => {
									const contenedor_labels = document.createElement('div')
									contenedor_labels.classList.add('contenedor_labels')
									contenedor.appendChild(contenedor_labels);
	
									generar_div("Nombre", producto.nombre, contenedor_labels)
									generar_div("Precio", Number(producto.precio).toLocaleString('es-ES'), contenedor_labels)
									generar_div("Descripcion", producto.descripcion, contenedor_labels)
									if (producto.extra.marca !== undefined) generar_div("Marca", producto.extra.marca, contenedor_labels);
	
									generar_div("Cantidad Solicitada", venta.cantidad[0][venta.detalles[0][contador].id], contenedor_labels);
									contador++;
	
									if (producto.extra.producto_type == 2) {
										generar_div("Medidas", producto.extra.medidas, contenedor_labels)
										generar_div("Calidad", producto.extra.calidad, contenedor_labels)
									} else if (producto.extra.producto_type == 3) {
										generar_div("Vizcocidad", producto.extra.vizcosidad, contenedor_labels)
										generar_div("Tipo", producto.extra.tipo, contenedor_labels)
									}
	
								});
							})
							.catch(function (error) {
								bootstrapAlert('Ha ocurrido un error al buscar la venta', 'error');
							});
	
						modal('#detallesVentaModal', 'show');
					}
				},
				button_excel
			],
			'select': true,
			'bInfo': false,
			'pageLength': 8,
			'destroy': true,
			'lengthChange': false,
			'deferRender': true,
			'language': { 'url': '/media/datatables-languages/es-ES_default.json' },
			'ajax': {
				'url': '/api/ventas',
				'type': 'GET',
				'dataSrc': '',
				'error': function (jqXHR, ajaxOptions, thrownError) {
					bootstrapAlert('Ha ocurrido un error al cargar las ventas ', 'error');
					console.log(data)
				}
			},
			'columns': [
					{"data": "id"},
					{"data": "nroVenta"},
					{"data": "fecha"},
					{"data": "cliente[0].cedula"},
					{"data": "cliente[0].shortname"},
					{"data": "total"}
				],
				"columnDefs": [
					{className: 'hidden', searchable: false, targets: [ 0 ]},
					{className: "font-semibold text-gray-700 dark:text-gray-400", targets: 0},
					{className: "text-gray-700 dark:text-gray-400", targets: "_all"},
					{
						// El índice de la columna que quieres formatear (empezando desde 0)
						"targets": [-1], 
						"render": function ( data, type, row ) {
							// Formatea el número usando la función Number.toLocaleString()
							return `$ ${Number(row.total).toLocaleString('es-ES')}`;
						}
					},
					
	
				]
		});

		$('#tabla_ventas tbody').off('click', 'tr').on('click', 'tr', function () {
            const venta_selected = document.querySelector('#venta_selected_id');
            const current_venta = this.children[0] ? this.children[0].innerText : '';


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
            table.button('btn_excel:name').nodes().attr('disabled', btn_disabled_value);
        });

		

    }
}

function productos_get_table_data(table_id) {
    let all_data_table = [];

    $('#' + table_id + ' tbody tr').each(function(index) {
        const producto_id = this.children[1].querySelector('.select_producto').value;
        const cantidad = this.children[2].children[0].children[1].value;
        const monto = this.children[3].children[0].children[1].value;

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

function productos_add_table_row(table_id) {
	const count = $('#' + table_id + ' tbody tr').length;
	const select_options = document.querySelector('#product_options').innerHTML;

	$('#' + table_id).find('tbody').append(
		`
		<tr class="text-gray-700 dark:text-gray-400">
			<td class="px-4 py-3">
				<div class="flex items-center text-sm">
					<div>
						<p class="font-semibold">${count+1}</p>

					</div>
				</div>
			</td>
			<td class="px-4 py-3">
				<div class="text-sm">
					<label class="block text-sm">
						<div class=" text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
							<select
								class="select_producto block w-24 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
								data-live-search="true">
								${select_options}
							</select>
						</div>
					</label>
				</div>
			</td>
			<td class="px-4 py-3 text-sm">
				<label class="block text-sm">
					<span class="text-gray-700 dark:text-gray-400">Cantidad</span>
					<input
						class="input_cantidad block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
						placeholder="0,00" step="1" min="1" value="1" oninput="validity.valid||(value='')" type="number"/>
				</label>
			</td>
			<td class="px-4 py-3 text-sm">
				<label class="block text-sm">
					<span class="text-gray-700 dark:text-gray-400">Monto</span>
					<input
						class="input_precio block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
						placeholder="0,00" step=".01" value="0.00" readonly />
						<input type="hidden" class="input_precio_original" readonly>
				</label>
			</td>
			<td class="px-4 py-3">
				<div class="flex items-center space-x-4 text-sm">
					<button
						class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
						aria-label="Delete" onclick="delete_row(this)"
				>
				<svg
					class=" w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"></path>
						</svg>
					</button>
				</div>
			</td>
		</tr>
		`
	);

	// $('.selectpicker').selectpicker();
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

function delete_row(btn) {
	btn.parentElement.parentElement.parentElement.remove();
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
