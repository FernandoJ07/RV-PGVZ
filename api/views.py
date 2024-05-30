import json
import re
from sqlite3 import OperationalError
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.forms import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from core.models import *
from core.utils import analyze_name

def serialize_data(data):
    names = analyze_name(data["fullname"])

    data['first_name'] = names["first_name"]
    data['middle_name'] = names["middle_name"]
    data['last_name'] = names["last_name"]
    data['last_name_2'] = names["last_name_2"]

    data.pop("fullname", None)

    return data

@csrf_exempt
def usuarios(request, id=None):
    if request.method != "GET" and not request.user.is_superuser:
        return JsonResponse({"error": "No permission."}, status=417)

    if request.method == "GET":
        if id != None:
            try:
                user = User.objects.get(id=id)
                return JsonResponse(user.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except User.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            
        return JsonResponse([user.serialize() for user in User.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)
        data = serialize_data(data)

        rol = data.pop("rol")
        if data['password'] != data['confirm_password']:
            return JsonResponse({"error": "PasswordsNotMatch."}, status=417)
        
        data.pop("confirm_password", None)

        try:
            if rol == "admin":
                data['is_gerente_ventas'] = False
                user = User.objects.create_superuser(**data)

            elif rol == "gerenteVentas":
                data['is_gerente_ventas'] = True
                User.objects.create_user(**data)
                
            else:
                data['is_gerente_ventas'] = False
                User.objects.create_user(**data)

            return JsonResponse({"message": "Usuario agregado exitosamente."}, status=201)
        except IntegrityError as e:
            if "UNIQUE constraint failed: core_user.cedula" in e.args:
                return JsonResponse({"error": "CedulaNotUnique."}, status=417)
            return JsonResponse({"error": "IntegrityError."}, status=417)
        except ValueError:
            return JsonResponse({"error": "ValueError."}, status=417)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        data = serialize_data(data)

        rol = data.pop("rol", None)

        if id != None:
            if not User.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                
                if rol == "Admin":
                    data['is_gerente_ventas'] = False
                    User.objects.filter(id=id).update(**data)
                    user = User.objects.get(id=id)
                    user.is_superuser = True
                    user.is_staff = True
                    user.save()

                elif rol == "GerenteVentas":
                    data['is_gerente_ventas'] = True
                    User.objects.filter(id=id).update(**data)
                    user = User.objects.get(id=id)
                    user.is_superuser = False
                    user.is_staff = False
                    user.save()
                else:
                    data['is_gerente_ventas'] = False
                    User.objects.filter(id=id).update(**data)
                    user = User.objects.get(id=id)
                    user.is_superuser = False
                    user.is_staff = False
                    user.save()

                    
                return JsonResponse({"message": "Usuario modificado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_user.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
        
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                User.objects.get(id=id).delete()
                return JsonResponse({"message": "Usuario eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except User.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

@csrf_exempt
def clientes(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                cliente = Cliente.objects.get(id=id)
                return JsonResponse(cliente.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([cliente.serialize() for cliente in Cliente.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)
        data = serialize_data(data)

        if id == None:
            try:
                cliente = Cliente.objects.create(**data)
                return JsonResponse({"message": "Cliente agregado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "CedulaNotUnique."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        data = serialize_data(data)

        if id != None:
            if not Cliente.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                cliente = Cliente.objects.filter(id=id).update(**data)
                return JsonResponse({"message": "Cliente modificado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_cliente.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                cliente = Cliente.objects.get(id=id).delete()
                return JsonResponse({"message": "Cliente eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

@csrf_exempt
def proveedores(request, id=None):
    
    if request.method == "GET":
        if id != None:
            try:
                proveedor = Proveedor.objects.get(id=id)
                return JsonResponse(proveedor.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "RifNotUnique."}, status=417)
            except Proveedor.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417) 

        return JsonResponse([proveedor.serialize() for proveedor in Proveedor.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)
        data = serialize_data(data)

        if id == None:
            try:
                proveedor = Proveedor.objects.create(**data)
                return JsonResponse({"message": "Proveedor agregado."}, status=201)
            except IntegrityError as e:
                    return JsonResponse({"error": "IntegrityError"}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        data = serialize_data(data)

        if id != None:
            if not Proveedor.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                proveedor = Proveedor.objects.filter(id=id).update(**data)
                return JsonResponse({"message": "Proveedor modificado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_proveedor.rif" in e.args:
                    return JsonResponse({"error": "RifNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                proveedor = Proveedor.objects.get(id=id).delete()
                return JsonResponse({"message": "Proveedor eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

@csrf_exempt
def productos(request, id=None, action=None):
    if request.method == "GET":
        if id != None:
            try:
                producto = Producto.objects.get(id=id)
                return JsonResponse(producto.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Producto.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([producto.serialize() for producto in Producto.objects.all()], safe=False)

    if request.method == "POST":
        data = json.loads(request.body)

        producto_tipo = data.get("producto_type", "1")
        producto_nombre = data.get("nombre", "")
        producto_descripcion = data.get("descripcion", "")
        producto_cantidad = data.get("cantidad", 0)
        producto_precio = data.get("precio", 0)

        producto_proveedor = Proveedor.objects.all().first().rif


        if producto_tipo == ProductoTypeChoices.PRODUCTO.value:
            producto = Producto.create_producto(producto_nombre, producto_descripcion, producto_cantidad, producto_precio, producto_tipo, producto_proveedor)
        
        else:
            producto = None

        return JsonResponse({"message": "Producto agregado."}, status=201)
    
    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            if not Producto.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            
            if not action:
                return JsonResponse({"error": "InvalidArgument."}, status=417)
                
            if action == 'add':
                try:    
                    producto_cantidad = int(data.get('cantidad', 0))

                    if producto_cantidad < 1:
                        return JsonResponse({"error": "ValueError."}, status=417)

                    producto = Producto.objects.get(id=id)
                    producto.add_cantidad(producto_cantidad, request.user)
                    producto.save()

                    return JsonResponse({"message": "Producto añadido."}, status=201)
                
                except IntegrityError:
                    return JsonResponse({"error": "IntegrityError."}, status=417)
                
                except ValueError:
                    return JsonResponse({"error": "ValueError."}, status=417)
                
            elif action == 'remove':
                try:
                    producto_cantidad = int(data.get('cantidad', 0))

                    if producto_cantidad < 1:
                        return JsonResponse({"error": "ValueError."}, status=417)

                    producto = Producto.objects.get(id=id)

                    if producto_cantidad > producto.get_cantidad():
                        return JsonResponse({"error": "InvalidAmount."}, status=417)

                    producto.remove_cantidad(producto_cantidad, usuario = request.user, cliente= None, monto=0)
                    producto.save()

                    return JsonResponse({"message": "Producto removido."}, status=201)
                
                except IntegrityError:
                    return JsonResponse({"error": "IntegrityError."}, status=417)
                
                except ValueError:
                    return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PUT":
        data = json.loads(request.body)

        producto_tipo = data.get("producto_type", "1")
        if id != None:
            if not Producto.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            dataProducto = {
                'nombre': data.get("nombre", ""),
                'descripcion': data.get("descripcion", "")
            }

            dataInventario = {
                'precio':  data.get("precio", 0)
            }
            
            try:
                Producto.objects.filter(id=id).update(**dataProducto)
                Inventario.objects.filter(producto=id).update(**dataInventario)

                return JsonResponse({"message": "Producto modificado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                Producto.objects.get(id=id).delete()
                return JsonResponse({"message": "Producto eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except User.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

@csrf_exempt
def ventas(request, id=None):

    if request.method == "GET":
        if id != None:
            try:
                venta = Venta.objects.get(id=id)
                return JsonResponse(venta.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            
        if not request.user.is_gerente_ventas and not request.user.is_superuser:
            ventas = Venta.objects.filter(vendedor=request.user)
        else:
            ventas = Venta.objects.all()
        return JsonResponse([venta.serialize() for venta in ventas], safe=False)
        
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            cliente_id = data['cliente']
            if not cliente_id:
                return JsonResponse({"error": "Debe escoger un cliente de la lista."}, status=400)

            try:
                cliente = Cliente.objects.get(id=cliente_id)
            except ObjectDoesNotExist:
                return JsonResponse({"error": "Cliente no encontrado."}, status=404)


            productos = data["productos"]
            if not productos:
                return JsonResponse({"error": "La lista de productos está vacía."}, status=400)


            with transaction.atomic():
                venta = Venta.objects.create(cliente=cliente, vendedor=request.user)
                total_venta = 0

                for producto in productos:
                    try:
                        producto_id = producto['producto_id']
                        cantidad = int(producto['cantidad'])
                        monto = float(producto['monto'])

                        producto = Producto.objects.get(id=producto_id)

                        if cantidad > producto.get_cantidad():
                            return JsonResponse({"error": "InvalidAmount."}, status=417)

                        DetalleVenta.objects.create(
                            venta=venta,
                            producto=producto,
                            cantidad=cantidad,
                            total_producto=monto
                        )

                        total_venta += monto
                        producto.remove_cantidad(cantidad, monto, cliente, request.user)
                        producto.save()


                    except (KeyError, ObjectDoesNotExist) as e:
                        return JsonResponse({"error": f"Error en el producto: {str(e)}"}, status=400)

                venta.total = total_venta
                venta.save()

            return JsonResponse({"message": "Venta creada exitosamente."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Error al decodificar JSON en la solicitud."}, status=400)

