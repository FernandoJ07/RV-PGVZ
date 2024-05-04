from datetime import date
import datetime
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms.models import model_to_dict
from django.db import transaction



from .serializers import *


class User(AbstractUser):
	cedula = models.CharField(max_length=10, unique=True, default="")		
	middle_name = models.CharField(max_length=150, default="", blank=True)		
	last_name_2 = models.CharField(max_length=150, default="", blank=True)
	num_tlf = models.CharField(max_length=15, default="", blank=True)

	def get_names(self):
		return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

	def get_last_names(self):
		return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_full_name(self):
		return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_short_name(self):
		return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")
	
	def get_rol(self):
		return "Admin" if self.is_superuser else "Usuario"
	
	def is_available_to_reset_password(self):
		return True if (self.pregunta_seguridad_id and self.respuesta_seguridad) else False

	def serialize(self):
		return UserSerializer(self)

class Persona(models.Model):
    first_name = models.CharField(max_length=150, blank=True)
    middle_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True)
    last_name_2 = models.CharField(max_length=150, blank=True, default="")
    fecha_nacimiento = models.DateField(blank=True, null=True)
    num_tlf = models.CharField(max_length=15, default="", blank=True)
    email = models.CharField(max_length=150)
    direccion = models.TextField(blank=True)

    class Meta:
        abstract = True

    def get_names(self):
        return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

    def get_last_names(self):
        return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

    def get_full_name(self):
        return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

    def get_short_name(self):
        return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")

    def get_age(self):
        return (date.today().year - self.fecha_nacimiento.year - ((date.today().month, date.today().day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day))) if self.fecha_nacimiento else None

    def __str__(self):
        return self.get_short_name()

class Cliente(Persona):
    cedula = models.CharField(max_length=10, unique=True)

    def serialize(self):
        return PersonaSerializer(self)

    def get_self(self):
        return self

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

class Proveedor(Persona):
    rif = models.CharField(max_length=10, unique=True)

    def serialize(self):
        return PersonaSerializer(self)

    def get_self(self):
        return self

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"

class ProductoTypeChoices(models.TextChoices):
	PRODUCTO = 1, "Producto"
	CAUCHO = 2, "Caucho"
	RIN = 3, "Rin"
	LUBRICANTE = 4, "Lubricante"

class Producto(models.Model):
	nombre = models.CharField(max_length=50, blank=False, default="")
	proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, default=None, null=True)
	descripcion = models.TextField()
	producto_type = models.IntegerField(default=1)

	class Meta:
		verbose_name = "Producto"
		verbose_name_plural = "Productos"

	def get_cantidad(self):
		try:
			inventario = Inventario.objects.filter(producto=self).first()
			return inventario.cantidad
		except Inventario.DoesNotExist:
			return 0
		
	def set_cantidad(self, cantidad):
		try:
			inventario = Inventario.objects.filter(producto=self).first()
			inventario.cantidad = int(cantidad)
			inventario.save()
			return inventario.cantidad
		except Inventario.DoesNotExist:
			return 0
		
	def add_cantidad(self, cantidad, usuario):
		try:
			inventario = Inventario.objects.filter(producto=self).first()
			inventario.cantidad += int(cantidad)
			inventario.save()

			Transaccion.objects.create(producto=self, accion="METER", cantidad=cantidad, usuario=usuario)
			return inventario.cantidad
		except Inventario.DoesNotExist:
			return 0
		
	def remove_cantidad(self, cantidad, monto, cliente, usuario):
		try:
			inventario = Inventario.objects.filter(producto=self).first()

			if int(cantidad) <= inventario.cantidad:
				inventario.cantidad -= int(cantidad)
				inventario.save()
			
			Transaccion.objects.create(producto=self, accion="SACAR", cantidad=cantidad, monto=monto, cliente=cliente, usuario=usuario)

			return inventario.cantidad
		
		except Inventario.DoesNotExist:
			return 0
		
	def get_precio(self):
		try:
			inventario = Inventario.objects.filter(producto=self).first()
			return inventario.precio
		except Inventario.DoesNotExist:
			return 0
		
	def set_precio(self, precio):
		try:
			inventario = Inventario.objects.filter(producto=self).first()
			inventario.precio = precio
			inventario.save()
			return inventario.precio
		except Inventario.DoesNotExist:
			return 0

	def get_extra_info(self):
		producto_type = str(self.producto_type)

		if producto_type == ProductoTypeChoices.PRODUCTO.value:
			return []
		
		elif producto_type == ProductoTypeChoices.CAUCHO.value:
			return Caucho.objects.filter(id=self.id).first().serialize() if Caucho.objects.filter(id=self.id).first() else []
		
		elif producto_type == ProductoTypeChoices.LUBRICANTE.value:
			return Lubricante.objects.filter(id=self.id).first().serialize() if Lubricante.objects.filter(id=self.id).first() else []

		elif producto_type == ProductoTypeChoices.RIN.value:
			return Rin.objects.filter(id=self.id).first().serialize() if Rin.objects.filter(id=self.id).first() else []
		
		else:
			return []
	
	def save(self, *args, **kwargs):
		created = not self.pk
		super(Producto, self).save(*args, **kwargs)
		
		if created:
			Inventario.objects.create(producto=self)

	@classmethod
	def create_producto(cls, nombre, descripcion, cantidad, precio, producto_type, proveedor):

		proveedor = Proveedor.objects.get(rif=proveedor)

		new_producto = cls(nombre=nombre, descripcion=descripcion, producto_type=ProductoTypeChoices.PRODUCTO, proveedor=proveedor)
		new_producto.save()

		new_producto.set_cantidad(cantidad)
		new_producto.set_precio(precio)

		return new_producto
	
	def serialize(self):
		return ProductoSerializer(self)
	
	def __str__(self):
		return f"Producto -> {self.id} - {self.nombre}"

class Caucho(Producto):
	marca = models.CharField(max_length=50, blank=False, default="")
	medidas = models.CharField(max_length=50, blank=False, default="")
	calidad = models.CharField(max_length=50, blank=False, default="")
	fecha_fabricacion = models.DateField(blank=True, null=True)

	@classmethod
	def create_caucho(cls, nombre, descripcion, cantidad, precio, producto_type, proveedor, detalles):
		proveedor = Proveedor.objects.get(rif=proveedor)

		new_producto = cls(nombre=nombre, descripcion=descripcion, producto_type=ProductoTypeChoices.CAUCHO, proveedor=proveedor,
			marca=detalles.get('marca', ''), medidas=detalles.get('medidas', ''), calidad=detalles.get('calidad', ''), fecha_fabricacion=detalles.get('fecha_fabricacion', '')
		)
		new_producto.save()

		new_producto.set_cantidad(cantidad)
		new_producto.set_precio(precio)

		return new_producto

	def serialize(self):
		return model_to_dict(self)
	
	def __str__(self):
		return f"Caucho -> {self.id} - {self.nombre}"

class Lubricante(Producto):
	marca = models.CharField(max_length=50, blank=False, default="")
	vizcosidad = models.CharField(max_length=50, blank=False, default="")
	tipo = models.CharField(max_length=50, blank=False, default="")

	@classmethod
	def create_lubricante(cls, nombre, descripcion, cantidad, precio, producto_type, proveedor, detalles):
		proveedor = Proveedor.objects.get(rif=proveedor)

		new_producto = cls(nombre=nombre, descripcion=descripcion, producto_type=ProductoTypeChoices.LUBRICANTE, proveedor=proveedor,
			marca=detalles.get('marca', ''), vizcosidad=detalles.get('vizcosidad', ''), tipo=detalles.get('tipo', '')
		)
		new_producto.save()

		new_producto.set_cantidad(cantidad)
		new_producto.set_precio(precio)

		return new_producto

	def serialize(self):
		return model_to_dict(self)
	
	def __str__(self):
		return f"Lubricante -> {self.id} - {self.nombre}"

class Rin(Producto):
	marca = models.CharField(max_length=50, blank=False, default="")
	material = models.CharField(max_length=50, blank=False, default="")
	tamano = models.CharField(max_length=50, blank=False, default="")
	fecha_fabricacion = models.DateField(blank=True, null=True)

	@classmethod
	def create_rin(cls, nombre, descripcion, cantidad, precio, producto_type, proveedor, detalles):
		proveedor = Proveedor.objects.get(rif=proveedor)

		new_producto = cls(nombre=nombre, descripcion=descripcion, producto_type=ProductoTypeChoices.RIN, proveedor=proveedor,
			marca=detalles.get('marca', ''), material=detalles.get('material', ''), tamano=detalles.get('tamano', ''), fecha_fabricacion=detalles.get('fecha_fabricacion', '')
		)
		new_producto.save()

		new_producto.set_cantidad(cantidad)
		new_producto.set_precio(precio)

		return new_producto

	def serialize(self):
		return model_to_dict(self)
	
	def __str__(self):
		return f"Caucho -> {self.id} - {self.nombre}"

class Inventario(models.Model):
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
	precio = models.FloatField(default=0)
	cantidad = models.IntegerField(default=0)

	def __str__(self):
		return f"Inventario -> {self.id} - {self.producto.id} - {self.producto.nombre}"

class Venta(models.Model):
	fecha = models.DateField(auto_now_add=True)
	cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	productos = models.ManyToManyField(Producto, through='DetalleVenta')
	total = models.FloatField(default=0)
	
	class Meta:
		verbose_name = "Venta"
		verbose_name_plural = "Ventas"

	def serialize(self):
		return VentaSerializer(self)
	
	def get_detalles_venta(self):
		return DetalleVenta.objects.filter(venta=self)
	
	def get_cantidad(self):
		try:
			detalles_venta = DetalleVenta.objects.filter(venta=self)
			cantidad_por_detalle_venta = {}

			for detalle in detalles_venta:
				detalle_id = detalle.id
				cantidad = detalle.cantidad

				if detalle_id in cantidad_por_detalle_venta:
					cantidad_por_detalle_venta[detalle_id] += cantidad
				else:
					cantidad_por_detalle_venta[detalle_id] = cantidad

			return cantidad_por_detalle_venta
		except DetalleVenta.DoesNotExist:
			return {}

	def __str__(self):
		return f"{self.id} - {self.fecha} - {self.cliente.get_names()}"
	
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    total_producto = models.FloatField()

		
    class Meta:
       verbose_name = "DetallesVenta"
       verbose_name_plural = "DetallesVentas"

    def serialize(self):
       return DetalleVentaSerialize(self)
    
    def __str__(self):
       return f"{self.venta.id} - {self.venta.cliente.get_names()} - {self.producto.nombre}"
	
class Servicio(models.Model):
	nombre = models.CharField(max_length=255)
	precio = models.FloatField(default=0)
	codigo = models.CharField(max_length=10, default="")

	class Meta:
		verbose_name = "Servicio"
		verbose_name_plural = "Servicios"

	def serialize(self):
		return ServicioSerialize(self)
	
	def __str__(self):
		return f"{self.codigo}-{self.nombre}"
	
class ServicioFacturacion(models.Model):
	cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	servicios = models.ManyToManyField(Servicio, through='DetalleServicioFacturacion')
	fecha_emision = models.DateField(auto_now_add=True)

	def getPrecioTotal(self):
		total = 0
		for servicio in self.servicios.all():
			total += servicio.precio
		return total
	
	def get_codigo(self):
		return (f"{self.fecha_emision.year}-{self.fecha_emision.month}-{str(self.id).zfill(4)}")
	
	def get_detalles_servicios(self):
		return DetalleServicioFacturacion.objects.filter(servicio_facturacion=self)

	class Meta:
		verbose_name = "ServicioFacturacion"
		verbose_name_plural = "ServiciosFacturacion"
		
	def serialize(self):
		return ServicioFacturadoSerialize(self)
	
	def __str__(self):
		return f"{self.id} - {self.cliente.get_names()}"
	
class DetalleServicioFacturacion(models.Model):
    servicio_facturacion = models.ForeignKey(ServicioFacturacion, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "DetalleServicioFacturacion"
        verbose_name_plural = "DetalleServiciosFacturacion"

    def serialize(self):
        return DetalleServicioFacturacion(self)

    def __str__(self):
        return f"{self.servicio_facturacion.id} - {self.servicio_facturacion.cliente.get_names()}"
	
class Transaccion(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    accion = models.CharField(max_length=50)
    cantidad = models.PositiveIntegerField()
    monto = models.FloatField(default=0, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, default=None, null=True)

    def serialize(self):
        return TransaccionSerializer(self)

    def __str__(self):
        return f"{self.accion} - {self.producto.nombre} - Cantidad: {self.cantidad} - Monto: {self.monto}"
    
class Factura(models.Model):
	venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
	descripcion = models.TextField()
	precio = models.FloatField(default=0)
	fecha_emision = models.DateField(auto_now_add=True)

	class Meta:
		verbose_name = "Factura"
		verbose_name_plural = "Facturas"

	def get_codigo(self):
		return (f"{self.fecha_emision.year}-{self.fecha_emision.month}-{str(self.id).zfill(3)}") if self.venta else ""

	def serialize(self):
		return FacturaSerializer(self)
	
	def __str__(self):
		return f"{self.get_codigo()} - {self.venta.cliente.get_names()}"

