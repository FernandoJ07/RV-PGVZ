from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Cliente)
admin.site.register(Proveedor)
admin.site.register(Producto)
admin.site.register(Caucho)
admin.site.register(Lubricante)
admin.site.register(Inventario)
admin.site.register(Venta)
admin.site.register(DetalleVenta)
admin.site.register(Transaccion)
admin.site.register(Factura)
admin.site.register(Servicio)
admin.site.register(ServicioFacturacion)
admin.site.register(DetalleServicioFacturacion)



