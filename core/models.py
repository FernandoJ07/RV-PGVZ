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
	is_gerente_ventas = models.BooleanField(default=False, blank=False, null=False)
	status = models.CharField(max_length=20, default='activo')

	def get_names(self):
		return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

	def get_last_names(self):
		return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_full_name(self):
		return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_short_name(self):
		return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")
	
	def get_rol(self):
		if self.is_superuser:
			return "Admin"
		elif self.is_gerente_ventas:
			return "Gerente de Ventas"
		else:
			return "Vendedor"
	
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
	status = models.CharField(max_length=20, default='activo')

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

			return inventario.cantidad
		except Inventario.DoesNotExist:
			return 0
		
	def remove_cantidad(self, cantidad, monto, cliente, usuario):
		try:
			inventario = Inventario.objects.filter(producto=self).first()

			if int(cantidad) <= inventario.cantidad:
				inventario.cantidad -= int(cantidad)
				inventario.save()
			

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

class Inventario(models.Model):
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
	precio = models.FloatField(default=0)
	cantidad = models.IntegerField(default=0)

	def __str__(self):
		return f"Inventario -> {self.id} - {self.producto.id} - {self.producto.nombre}"

class Venta(models.Model):
	fecha = models.DateField(auto_now_add=True)
	cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	vendedor = models.ForeignKey(User,on_delete=models.CASCADE)
	productos = models.ManyToManyField(Producto, through='DetalleVenta')
	total = models.FloatField(default=0)
	
	class Meta:
		verbose_name = "Venta"
		verbose_name_plural = "Ventas"

	def serialize(self):
		return VentaSerializer(self)
	
	def get_nro_venta(self):
		padded_id = str(self.id).zfill(4)
		return f'NIT123456789-{padded_id}'
	
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
	
