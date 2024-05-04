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

        is_superuser = True if (data["rol"] == "Admin") else False
        data.pop("rol", None)

        if data['password'] != data['confirm_password']:
            return JsonResponse({"error": "PasswordsNotMatch."}, status=417)
        
        data.pop("confirm_password", None)

        try:
            if is_superuser:
                User.objects.create_superuser(**data)
            else:
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

        data['is_superuser'] = True if (data["rol"] == "Admin") else False
        data.pop("rol", None)

        if id != None:
            if not User.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                User.objects.filter(id=id).update(**data)
                
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

        caucho_marca = data.get("caucho_marca", "")
        caucho_medidas = data.get("caucho_medidas", "")
        caucho_calidad = data.get("caucho_calidad", "")
        caucho_fabricacion = data.get("caucho_fabricacion", "")
        
        rin_marca = data.get("rin_marca", "")
        rin_material = data.get("rin_material", "")
        rin_tamano = data.get("rin_tamano", "")
        rin_fabricacion = data.get("rin_fabricacion", "")

        if producto_tipo == ProductoTypeChoices.PRODUCTO.value:
            producto = Producto.create_producto(producto_nombre, producto_descripcion, producto_cantidad, producto_precio, producto_tipo, producto_proveedor)
        
        elif producto_tipo == ProductoTypeChoices.CAUCHO.value:
            detalles = {"marca": caucho_marca, "medidas": caucho_medidas, "calidad": caucho_calidad, "fecha_fabricacion": caucho_fabricacion}

            producto = Caucho.create_caucho(producto_nombre, producto_descripcion, producto_cantidad, producto_precio, producto_tipo, producto_proveedor, detalles)

        elif producto_tipo == ProductoTypeChoices.RIN.value:
            detalles = {"marca": rin_marca, "material": rin_material, "tamano": rin_tamano, "fecha_fabricacion": rin_fabricacion}

            producto = Rin.create_rin(producto_nombre, producto_descripcion, producto_cantidad, producto_precio, producto_tipo, producto_proveedor, detalles)

        else:
            producto = None

        if producto != None:
            Transaccion.objects.create(producto=producto, accion="METER", cantidad=producto_cantidad)

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
            
            dataCaucho = {
                'marca': data.get("caucho_marca", ""),
                'medidas': data.get("caucho_medidas", ""),
                'calidad': data.get("caucho_calidad", ""),
                'fecha_fabricacion': data.get("caucho_fabricacion", "")
            }

            dataRin = {
                'marca': data.get("rin_marca", ""),
                'material': data.get("rin_material", ""),
                'tamano': data.get("rin_tamano", ""),
                'fecha_fabricacion': data.get("rin_fabricacion", "")
            }

            try:
                Producto.objects.filter(id=id).update(**dataProducto)
                Inventario.objects.filter(producto=id).update(**dataInventario)

                if producto_tipo == ProductoTypeChoices.CAUCHO:
                    Caucho.objects.filter(id=id).update(**dataCaucho)

                elif producto_tipo == ProductoTypeChoices.RIN:
                    Rin.objects.filter(id=id).update(**dataRin)

                return JsonResponse({"message": "Producto modificado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

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
        return JsonResponse([venta.serialize() for venta in Venta.objects.all()], safe=False)
        
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
                venta = Venta.objects.create(cliente=cliente)
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

                Factura.objects.create(venta=venta, descripcion="", precio=venta.total)

            return JsonResponse({"message": "Venta creada exitosamente."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Error al decodificar JSON en la solicitud."}, status=400)

@csrf_exempt        
def transacciones(request):
    if request.method == "GET":
        return JsonResponse([transacciones.serialize() for transacciones in Transaccion.objects.all()], safe=False)
    
@csrf_exempt
def factura(request, id=None):

    if request.method == "GET":
        try:
            venta = Venta.objects.get(id=id)
            factura = Factura.objects.filter(venta=venta).first()

            if factura:
                return JsonResponse(factura.serialize(), safe=False)
            else:
                return JsonResponse({"mensaje": "Debe generar la factura antes de visualizarla"}, status=404)

        except Exception as e:
            return JsonResponse({"error": f"Error al obtener la factura: {str(e)}"}, status=500)
        
    if request.method == "POST":
        data = json.loads(request.body)

        try:
            venta = Venta.objects.filter(id=data['venta_id']).first()
            
            if not venta:
                return JsonResponse({"error": "Venta no encontrada con el ID proporcionado"}, status=404)
            
            if Factura.objects.filter(venta=venta).exists():
                return JsonResponse({"error": "Ya se ha generado una factura para esta venta"}, status=409)


            dataInfo = {
                'venta': venta,
                'descripcion': data['descripcion'],
                'precio': venta.total
            }

            Factura.objects.create(**dataInfo)
            return JsonResponse({"success": "La factura ha sido registrada exitosamente"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Error al crear la factura: {str(e)}"}, status=500)
        
@csrf_exempt
def servicios(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                servicio = Servicio.objects.get(id=id)
                return JsonResponse(servicio.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except User.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            
        return JsonResponse([servicio.serialize() for servicio in Servicio.objects.all()], safe=False)
    
    if request.method == "POST":

        if id == None:
            try:
                data = json.loads(request.body)
                Servicio.objects.create(**data)
                return JsonResponse({"message": "Servicio agregado."}, status=201)
            
            except (IntegrityError, OperationalError) as e:
                return JsonResponse({"error": str(e)}, status=400)
        
        try:
            data = json.loads(request.body)

            cliente_id = data['cliente']
            if not cliente_id:
                return JsonResponse({"error": "Debe escoger un cliente de la lista."}, status=400)

            try:
                Cliente.objects.get(id=cliente_id)
            except ObjectDoesNotExist:
                return JsonResponse({"error": "Cliente no encontrado."}, status=404)

            servicios = data["servicios"]
            if not servicios:
                return JsonResponse({"error": "La lista de servicios está vacía."}, status=400)

            with transaction.atomic():
                
                for servicio in servicios:
                    servicio_codigo = servicio['codigo']
                    try:
                        servicio = Servicio.objects.get(codigo=servicio_codigo)
                    except ObjectDoesNotExist:
                        return JsonResponse({"error": f"El servicio con código {servicio_codigo} no existe."}, status=400)
                    
            return JsonResponse({"message": "Servicio creado exitosamente."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Error al decodificar JSON en la solicitud."}, status=400)
        

    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            if not Servicio.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                Servicio.objects.filter(id=id).update(**data)
                
                return JsonResponse({"message": "Servicio modificado."}, status=201)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
        
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                Servicio.objects.get(id=id).delete()
                return JsonResponse({"message": "Servicio eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Servicio.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

@csrf_exempt
def servicioFacturado(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                servicio_facturacion = ServicioFacturacion.objects.get(id=id)
                return JsonResponse(servicio_facturacion.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
        return JsonResponse([servicio_facturacion.serialize() for servicio_facturacion in ServicioFacturacion.objects.all()], safe=False)
        
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


            servicios = data["servicios"]
            if not servicios:
                return JsonResponse({"error": "La lista de servicios está vacía."}, status=400)
            

            with transaction.atomic():
                servicio_facturacion = ServicioFacturacion.objects.create(cliente=cliente)

                for servicio in servicios:
                    try:
                        servicio_codigo = servicio['codigo']
                        servicio = Servicio.objects.get(codigo=servicio_codigo)

                        DetalleServicioFacturacion.objects.create(
                            servicio_facturacion=servicio_facturacion,
                            servicio=servicio,
                        )

                    except (KeyError, ObjectDoesNotExist) as e:
                        return JsonResponse({"error": f"Error en el servicio: {str(e)}"}, status=400)

            return JsonResponse({"message": "Servicio facturado exitosamente."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Error al decodificar JSON en la solicitud."}, status=400)
