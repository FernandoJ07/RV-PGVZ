from django.forms.models import model_to_dict

from core.models import *

def user_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["names"] = self.get_names()
	dict_model["last_names"] = self.get_last_names()
	dict_model["fullname"] = self.get_full_name()
	dict_model["shortname"] = self.get_short_name()
	dict_model["rol"] = self.get_rol()
	dict_model.pop("password", None)
	return dict_model

def persona_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["names"] = self.get_names()
	dict_model["last_names"] = self.get_last_names()
	dict_model["fullname"] = self.get_full_name()
	dict_model["shortname"] = self.get_short_name()
	dict_model["age"] = self.get_age()
	return dict_model

def producto_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["cantidad"] = self.get_cantidad()
	dict_model["precio"] = self.get_precio()
	dict_model["extra"] = self.get_extra_info()
	dict_model["proveedor"] = self.proveedor.get_names()
	return dict_model

def venta_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["fecha"] = self.fecha,
	dict_model["cliente"] = self.cliente.serialize(),
	dict_model["productos"] = [producto.serialize() for producto in self.productos.all()],
	dict_model["cantidad"] = self.get_cantidad(),
	dict_model["detalles"] = [detalles.serialize() for detalles in self.get_detalles_venta()],

	return dict_model

def detalle_venta_serialize(self):
	dict_model = model_to_dict(self)
	return dict_model


def transaccion_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["producto"] = self.producto.serialize(),
	dict_model["usuario"] = self.usuario.username if self.usuario else "N/A",
	dict_model["cliente"] = self.cliente.get_names() if self.cliente else "N/A",

	return dict_model

def factura_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["codigo"] = self.get_codigo()
	return dict_model

def servicio_serialize(self):
	dict_model = model_to_dict(self)
	return dict_model

def servicio_facturado_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["precio"] = self.getPrecioTotal()
	dict_model["cliente"] = self.cliente.serialize()
	dict_model["servicios"] = [servicio.serialize() for servicio in self.servicios.all()]
	return dict_model

def detalles_servicio_facturado_serialize(self):
	dict_model = model_to_dict(self)
	return dict_model
	

UserSerializer = user_serialize
PersonaSerializer = persona_serialize
ProductoSerializer = producto_serialize
VentaSerializer = venta_serialize
TransaccionSerializer = transaccion_serialize
FacturaSerializer = factura_serialize
ServicioSerialize = servicio_serialize
ServicioFacturadoSerialize = servicio_facturado_serialize
DetalleVentaSerialize = detalle_venta_serialize
DetalleServicioFacturadoSerialize = detalles_servicio_facturado_serialize

