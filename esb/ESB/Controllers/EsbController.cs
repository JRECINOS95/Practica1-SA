using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using ESB.Clases;
using ESB.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ESB.Controllers
{
    [Consumes("application/json", "application/json-patch+json", "multipart/form-data")]
    [ApiController]
    public class EsbController : Controller
    {

        private string RequestGet(String baseURL, String bodyContent)
        {
            WebRequest request = WebRequest.Create(baseURL);
            request.Method = "GET";
            request.ContentType = "application/json";

            if (bodyContent != "")
            {
                string postData = bodyContent.ToString();
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                request.ContentLength = byteArray.Length;
                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
            }
            
            WebResponse response = request.GetResponse();
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            String data = "";
            using (Stream dataStream = response.GetResponseStream())
            {
                StreamReader reader = new StreamReader(dataStream);
                data = reader.ReadToEnd();
                Console.WriteLine("Respuesta: ");
                Console.WriteLine(data.ToString());
            }
            response.Close();
            return data;
        }


        private async Task<ResultRequest> RequestPostPutDeleteAsync(String baseURL, String method, dynamic bodyContent)
        {
            ResultRequest resultado;
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(String.Format("http://{0}", "localhost"));
                    client.DefaultRequestHeaders.Accept.Clear();
                    HttpContent httpContent = new StringContent(bodyContent.ToString(), Encoding.UTF8);
                    httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");


                    if(method=="POST" || method == "PUT")
                    {
                        Console.WriteLine("Body: ");
                        Console.WriteLine(bodyContent.ToString());
                    }

                    HttpResponseMessage result=null;
                    if (method == "POST")
                        result = await client.PostAsync(baseURL, httpContent);
                    else if (method == "PUT")
                        result = await client.PutAsync(baseURL, httpContent);
                    else if (method == "DELETE")
                        result = await client.DeleteAsync(baseURL);

                    using (HttpResponseMessage res = result)
                    {
                        using (HttpContent content = res.Content)
                        {
                            string data = await content.ReadAsStringAsync();
                            if (data != null)
                            {
                                Console.WriteLine("Respuesta: ");
                                Console.WriteLine(data.ToString());
                                resultado = new ResultRequest(data.ToString(), false,"");
                                return resultado;
                                //return Content(data, "application/json");
                            }
                            else
                            {
                                Console.WriteLine("Respuesta: ");
                                Console.WriteLine("");
                                resultado = new ResultRequest("", true,"");
                                return resultado;
                                //return new BadRequestResult();
                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                resultado = new ResultRequest(exception.Message, true,exception.Message);
                return resultado;
                //return BadRequest(exception.Message);
            }
        }


        [HttpGet, Route("/grupo19/{api}/{valor}/{grupo}")]
        public ActionResult<IEnumerable<String>> GetRequestParams(String api, String valor, String grupo)
        {
            try
            {
                DotNetEnv.Env.Load("../.env");
                Console.WriteLine("");
                Console.WriteLine("Ingreso a " + api + "/" + valor + "por metodo GET");
                string baseURL = "";

                //Console.WriteLine(DotNetEnv.Env.GetString("DB_USER_PROD", "NO SE OBTUVO EL KEY DEL .env"));
                String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
                

                if (api == "libroseditorial" && grupo == "GRUPO17")
                {
                    baseURL = "http://18.118.111.108:3636/api/products?limit=100";
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado);
                    List<dynamic> listado = new List<dynamic>();

                    foreach (dynamic element in data.products)
                    {
                        if (element.stock > 0 && element.proveedor == 1)
                        {
                            dynamic convertido = new ExpandoObject();
                            convertido.id = element.id;
                            convertido.nombre = element.nombre;
                            convertido.url = element.imagen;
                            convertido.autor = "";
                            convertido.status = "ACTIVO";
                            convertido.stock = element.stock;
                            convertido.idUser = element.proveedor;
                            convertido.precio = element.precio_cliente;
                            convertido.generos = new List<string>();
                            listado.Add(convertido);
                        }
                    }
                    return Content(JsonConvert.SerializeObject(listado), "application/json");
                }
                else if (api == "libroseditorial" && grupo == "GRUPO18")
                {
                    baseURL = "http://157.230.218.35:9000/api/";
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado);
                    List<dynamic> listado = new List<dynamic>();

                    foreach (dynamic element in data)
                    {
                        if (element.cantidad > 0 && element.editorial ==3)
                        {
                            dynamic convertido = new ExpandoObject();
                            convertido.id = element.idl;
                            convertido.nombre = element.nombre;
                            convertido.url = element.imagen;
                            convertido.autor = element.autor;
                            convertido.status = "ACTIVO";
                            convertido.stock = element.cantidad;
                            convertido.idUser = element.editorial;
                            convertido.precio = element.precio;
                            convertido.generos = new List<string>();
                            listado.Add(convertido);
                        }
                    }
                    return Content(JsonConvert.SerializeObject(listado), "application/json");
                }
                else if ((api == "libroseditorial" || api == "libroget") && grupo == "GRUPO19")
                {
                    ManejadorRutas rutas = new ManejadorRutas(user, "GET");
                    if (!rutas.existeAcceso(api, "GET"))
                        return new BadRequestResult();
                    baseURL = rutas.getURL(api, valor, "", "");
                    Console.WriteLine("RutaBase= " + baseURL);
                    String data = RequestGet(baseURL, "");
                    if (data != null)
                    {
                        return Content(data, "application/json");
                    }
                    else
                    {
                        return new BadRequestResult();
                    }
                }
                else if (api == "libroget" && grupo == "GRUPO17")
                {
                    baseURL = "http://18.118.111.108:3636/api/products/"+valor;
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic element = JsonConvert.DeserializeObject<dynamic>(resultado);
                    dynamic convertido = new ExpandoObject();
                    convertido.id = element.id;
                    convertido.nombre = element.nombre;
                    convertido.url = element.imagen;
                    convertido.autor = "";
                    convertido.status = "ACTIVO";
                    convertido.stock = element.stock;
                    convertido.idUser = element.proveedor;
                    convertido.precio = element.precio_cliente;
                    convertido.generos = new List<string>();
                    return Content(JsonConvert.SerializeObject(convertido), "application/json");
                }
                else if (api == "libroget" && grupo == "GRUPO18")
                {
                    baseURL = "http://157.230.218.35:9000/api/libro/" + valor;
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic element = JsonConvert.DeserializeObject<dynamic>(resultado);
                    element = element[0];
                    dynamic convertido = new ExpandoObject();
                    convertido.id = element.idl;
                    convertido.nombre = element.nombre;
                    convertido.url = element.imagen;
                    convertido.autor = element.autor;
                    convertido.status = "ACTIVO";
                    convertido.stock = element.cantidad;
                    convertido.idUser = 3;
                    convertido.precio = element.precio;
                    convertido.generos = new List<string>();
                    return Content(JsonConvert.SerializeObject(convertido), "application/json");
                }
                else
                {
                    return new BadRequestResult();
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return BadRequest(exception.Message);
            }
        }

        [HttpGet, Route("/grupo19/{api}/{valor}")]
        public ActionResult<IEnumerable<String>> GetRequestParams(String api,String valor)
        {
            try
            {
                DotNetEnv.Env.Load("../.env");
                Console.WriteLine("");
                Console.WriteLine("Ingreso a " + api + "/" + valor + "por metodo GET");
                string baseURL = "";

                //Console.WriteLine(DotNetEnv.Env.GetString("DB_USER_PROD", "NO SE OBTUVO EL KEY DEL .env"));
                String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
                ManejadorRutas rutas = new ManejadorRutas(user, "GET");

                if (api=="librolist" && valor == "GRUPO17")
                {
                    baseURL = "http://18.118.111.108:3636/api/products?limit=100";
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado);
                    List<dynamic> listado = new List<dynamic>();

                    foreach(dynamic element in data.products)
                    {
                        if(element.stock > 0)
                        {
                            dynamic convertido = new ExpandoObject();
                            convertido.id = element.id;
                            convertido.nombre = element.nombre;
                            convertido.url = element.imagen;
                            convertido.autor = "";
                            convertido.status = "ACTIVO";
                            convertido.stock = element.stock;
                            convertido.idUser = element.proveedor;
                            convertido.precio = element.precio_cliente;
                            convertido.generos = new List<string>();
                            listado.Add(convertido);
                        }
                    }
                    return Content(JsonConvert.SerializeObject(listado), "application/json");
                }
                else if(api=="librolist" && valor == "GRUPO18")
                {
                    baseURL = "http://157.230.218.35:9000/api/";
                    Console.WriteLine("RutaBase= " + baseURL);
                    String resultado = RequestGet(baseURL, "");
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado);
                    List<dynamic> listado = new List<dynamic>();

                    foreach (dynamic element in data)
                    {
                        if (element.cantidad > 0)
                        {
                            dynamic convertido = new ExpandoObject();
                            convertido.id = element.idl;
                            convertido.nombre = element.nombre;
                            convertido.url = element.imagen;
                            convertido.autor = element.autor;
                            convertido.status = "ACTIVO";
                            convertido.stock = element.cantidad;
                            convertido.idUser = element.editorial;
                            convertido.precio = element.precio;
                            convertido.generos = new List<string>();
                            listado.Add(convertido);
                        }
                    }
                    return Content(JsonConvert.SerializeObject(listado), "application/json");
                }
                else if (api == "librolist" && valor == "GRUPO19")
                {
                    if (!rutas.existeAcceso(api, "GET"))
                        return new BadRequestResult();
                    baseURL = rutas.getURL(api, "", "", "");
                    Console.WriteLine("RutaBase= " + baseURL);
                    String data = RequestGet(baseURL, "");
                    if (data != null)
                    {
                        return Content(data, "application/json");
                    }
                    else
                    {
                        return new BadRequestResult();
                    }
                }
                else
                {
                    if (!rutas.existeAcceso(api, "GET"))
                        return new BadRequestResult();
                    baseURL = rutas.getURL(api, valor, "", "");
                    Console.WriteLine("RutaBase= " + baseURL);
                    String data = RequestGet(baseURL, "");
                    if (data != null)
                    {
                         return Content(data, "application/json");
                    }
                    else
                    {
                         return new BadRequestResult();
                    }
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return BadRequest(exception.Message);
            }
        }


        [HttpGet, Route("/grupo19/{api}")]
        public async Task<ActionResult<IEnumerable<string>>> GetRequestValueAsync(String api)
        {
            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api + "por metodo GET");
            ///se obtiene el body si se tuviera
            string body="";
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8, true, 1024, true))
            {
                body = await reader.ReadToEndAsync();
            }
            DotNetEnv.Env.Load("../.env");
            Console.WriteLine(DotNetEnv.Env.GetString("DB_USER_PROD", "NO SE OBTUVO EL KEY DEL .env"));
            String user = DotNetEnv.Env.GetString("DB_USER_PROD", "server=34.71.141.177;port=3306;Database=sofware;user=root;Password=C9weKeyLyLIOmOIc;Convert Zero Datetime=True;");

            ManejadorRutas rutas = new ManejadorRutas(user, "GET");
            if (!rutas.existeAcceso(api, "GET"))
                return new BadRequestResult();

            string baseURL = rutas.getURL(api, "", "", "");
            Console.WriteLine("RutaBase= " + baseURL);
            try
            {
                //se obtiene el json resultante
                String data = RequestGet(baseURL, body);
                if (data != null)
                {
                    return Content(data, "application/json");
                }
                else
                {
                    return new BadRequestResult();
                }

            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return BadRequest(exception.Message);
            }
        }

        [HttpPost, Route("/grupo19/{api}/{funcionalidad}")]
        public async Task<IActionResult> UrlPost(String api, String funcionalidad, [FromBody] dynamic bodyContent)
        {
            DotNetEnv.Env.Load("../.env");

            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api + "/" + funcionalidad + "por metodo POST");
            JObject json = JObject.Parse(bodyContent.ToString());
            string baseURL = "";

            string grupo = "GRUPO19";
            try
            {
                grupo = json["grupo"].ToString();
            }catch {}

            Console.WriteLine("GRUPO ---> "+ grupo);

            if (grupo == "GRUPO17")
            {
                if (api == "usuario" && funcionalidad == "login") //login 17
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.email = json["user"].ToString();
                    flexible.password = json["password"].ToString();
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://18.118.111.108:3636/api/users/login";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado.httpContent);
                        dynamic salida = new ExpandoObject();
                        salida.id = data.id;
                        salida.primer_nombre = data.nombre;
                        salida.segundo_nombre = "";
                        salida.primer_apellido = data.apellido;
                        salida.segundo_apellido = "";
                        salida.status = "ACTIVO";
                        salida.rol = "CLIENTE";
                        salida.username = json["user"].ToString();
                        salida.telefono = data.celular;
                        salida.direccion = "";
                        salida.validado = true;
                        salida.password = json["password"].ToString();
                        return Content(JsonConvert.SerializeObject(salida), "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
                else if(api == "user" && funcionalidad == "register")
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.nombre = json["primerNombre"].ToString();
                    flexible.apellido = json["primerApellido"].ToString();
                    flexible.celular = json["telefono"].ToString();
                    flexible.email = json["username"].ToString();
                    flexible.foto = "";
                    flexible.password = json["password"].ToString();
                    flexible.tipo_usuario = 0;
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://18.118.111.108:3636/api/users/registro";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
                else if (api == "libro" && funcionalidad == "add")
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.id = 0;
                    flexible.category = "";
                    flexible.imagen = json["url"].ToString();
                    flexible.images = "";
                    flexible.nombre = json["nombre"].ToString();
                    flexible.precio_cliente = json["precio"].ToString();
                    flexible.proveedor = 1;
                    flexible.stock = json["stock"].ToString();
                    flexible.valor_unitario = json["precio"].ToString();
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://18.118.111.108:3636/api/prodproveedor/agregar";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
                else if (api == "compra" && funcionalidad == "ingresar")
                {
                    dynamic flexible = new ExpandoObject();

                    flexible.userId = json["idUser"].ToString();
                    flexible.products = new List<dynamic>();

                    dynamic producto = new ExpandoObject();
                    producto.codigo = json["idLibro"].ToString();
                    producto.incart = json["cantidad"].ToString();
                    producto.id = json["idLibro"].ToString();

                    flexible.products.Add(producto);

                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://18.118.111.108:3636/api/orders/new";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
            }
            else if(grupo == "GRUPO18")
            {
                if(api=="usuario" && funcionalidad == "login")  //login 18
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.usuario = json["user"].ToString();
                    flexible.contra = json["password"].ToString();
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://157.230.218.35:3000/api/login/cliente";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        dynamic data = JsonConvert.DeserializeObject<dynamic>(resultado.httpContent);
                        dynamic salida = new ExpandoObject();
                        salida.id = data.datos.idc; 
                        salida.primer_nombre = data.datos.nombres;
                        salida.segundo_nombre = "";
                        salida.primer_apellido = data.datos.apellidos;
                        salida.segundo_apellido = "";
                        salida.status = "ACTIVO";
                        salida.rol = "CLIENTE";
                        salida.username = json["user"].ToString();
                        salida.telefono = 12345678;
                        salida.direccion = "";
                        salida.validado = true;
                        salida.password = json["password"].ToString();
                        return Content(JsonConvert.SerializeObject(salida), "application/json");

                    }
                    return BadRequest(resultado.strError);
                }
                else if (api == "user" && funcionalidad == "register")
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.nombre = json["primerNombre"].ToString();
                    flexible.apellido = json["primerApellido"].ToString();
                    flexible.correo = json["username"].ToString();
                    flexible.estado = "1";
                    flexible.password = json["password"].ToString();
                    flexible.tipo = "1";
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://157.230.218.35:3000/api/signup";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
                else if (api == "libro" && funcionalidad == "add")
                {
                    dynamic flexible = new ExpandoObject();
                    flexible.nombre = json["nombre"].ToString();
                    flexible.autor = json["autor"].ToString();
                    flexible.precio = json["precio"].ToString();
                    flexible.cantidad = json["stock"].ToString();
                    flexible.estado = 1;
                    flexible.imagen = json["url"].ToString();
                    flexible.editorial = 3;
                    flexible.generos = new List<string>();

                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://157.230.218.35:9000/api/";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
                else if (api == "compra" && funcionalidad == "ingresar")
                {
                    dynamic flexible = new ExpandoObject();

                    flexible.id_usuario = json["idUser"].ToString();
                    flexible.fecha = new DateTime().ToString("yyyy/MM/dd");
                    bodyContent = JsonConvert.SerializeObject(flexible);
                    baseURL = "http://157.230.218.35:3600/api/ordenes";
                    Console.WriteLine("RutaBase= " + baseURL);
                    ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                    if (!resultado.error)
                    {
                        return Content(resultado.httpContent, "application/json");
                    }
                    return BadRequest(resultado.strError);
                }
            }
            else
            {
                String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
                ManejadorRutas rutas = new ManejadorRutas(user, "POST");
                if (!rutas.existeAcceso(api + "." + funcionalidad, "POST"))
                    return new BadRequestResult();

                baseURL = rutas.getURL(api + "." + funcionalidad, "", "", "");
                Console.WriteLine("RutaBase= " + baseURL);
                ResultRequest resultado = await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);
                if (!resultado.error)
                {
                    return Content(resultado.httpContent, "application/json");
                }
                return BadRequest(resultado.strError);
            }
            return new BadRequestResult();
        }

    }
}

