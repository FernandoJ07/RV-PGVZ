from django.urls import path

from . import views

urlpatterns = [
    path("clientes/", views.clientes, name="clientes"),
	path("clientes/<int:id>", views.clientes, name="clientes"),    
	path("productos/", views.productos, name="productos"),
	path("productos/<int:id>", views.productos, name="productos"),
    path("productos/<int:id>/<str:action>", views.productos, name="productos"),
	path("ventas/", views.ventas, name="ventas"),
	path("ventas/<int:id>", views.ventas, name="ventas"),
	path("proveedores/", views.proveedores, name="proveedores"),
	path("proveedores/<int:id>", views.proveedores, name="proveedores"),
    path("usuarios/", views.usuarios, name="usuarios"),
    path("usuarios/<int:id>", views.usuarios, name="usuarios"),
]