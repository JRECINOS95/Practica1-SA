using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using ESB.Models;
using Microsoft.AspNetCore.Mvc;

namespace ESB.Controllers
{
    [Consumes("application/json", "application/json-patch+json", "multipart/form-data")]
    [ApiController]
    public class EsbController : Controller
    {
        /// <summary>
        /// Metodo general para realizar solicitud GET
        /// </summary>
        /// <param name="baseURL">URL del Servicio que se va a consultar</param>
        /// <returns>Un String con el JSON obtenido en la consulta</returns>
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

        /// <summary>
        /// Metodo general para realizar solicitud POST, PUT, DELETE
        /// </summary>
        /// <param name="baseURL">URL del Servicio que se va a consultar</param>
        /// <param name="method">Valor si será POST,PUT,DELETE</param>
        /// <returns>Un String con el JSON obtenido en la consulta</returns
        private async Task<IActionResult> RequestPostPutDeleteAsync(String baseURL, String method, dynamic bodyContent)
        {
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
                                return Content(data, "application/json");
                            }
                            else
                            {
                                Console.WriteLine("Respuesta: ");
                                Console.WriteLine("");
                                return new BadRequestResult();
                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return BadRequest(exception.Message);
            }
        }

        /// <summary>
        /// Metodo POST general para la recepcion de solicitud de este tipo, se tiene el valor {api} y {funcionalidad} como el verbo del servicio que se va a consumir
        /// </summary>
        /// <param name="api">Verbo del nombre maquillado del servicio que se desea consumir</param>
        /// <param name="funcionalidad">Verbo del nombre maquillado de la funcionalidad del API que se desea consumir</param>
        /// <param name="email">parametro de email</param>
        /// <param name="password">parametro de password</param>
        /// <returns></returns>
        [HttpGet, Route("/grupo19/{api}/{valor}")]
        public ActionResult<IEnumerable<String>> GetRequestParams(String api,String valor)
        {
            DotNetEnv.Env.Load("../.env");

            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api+"/" + valor + "por metodo GET");

            //Console.WriteLine(DotNetEnv.Env.GetString("DB_USER_PROD", "NO SE OBTUVO EL KEY DEL .env"));
            String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
            ManejadorRutas rutas = new ManejadorRutas(user, "GET");
            if (!rutas.existeAcceso(api,"GET"))
                return new BadRequestResult();

            string baseURL = rutas.getURL(api, valor, "", "");
            Console.WriteLine("RutaBase= " + baseURL);
            try
            {
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
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return BadRequest(exception.Message);
            }
        }

        /// <summary>
        /// Metodo POST general para la recepcion de solicitud de este tipo, se tiene el valor {api} y {funcionalidad} como el verbo del servicio que se va a consumir
        /// </summary>
        /// <param name="api">Verbo del nombre maquillado del servicio que se desea consumir</param>
        /// <param name="funcionalidad">Verbo del nombre maquillado de la funcionalidad del API que se desea consumir</param>
        /// <param name="value">valor que se estara agregando para concatenarlo en la URL</param>
        /// <returns></returns>
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

        /// <summary>
        /// Metodo POST general para la recepcion de solicitud de este tipo, se tiene el valor {api} y {funcionalidad} como el verbo del servicio que se va a consumir
        /// </summary>
        /// <param name="api">Verbo del nombre maquillado del servicio que se desea consumir</param>
        /// <param name="funcionalidad">Verbo del nombre maquillado de la funcionalidad del API que se desea consumir</param>
        /// <param name="bodyContent">Contenido del POST obtenido</param>
        /// <returns>Retorna el resultado de la consulta correcta o fallida</returns>
        [HttpPost, Route("/grupo19/{api}/{funcionalidad}")]
        public async Task<IActionResult> UrlPost(String api, String funcionalidad, [FromBody] dynamic bodyContent)
        {
            DotNetEnv.Env.Load("../.env");

            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api + "/" + funcionalidad + "por metodo POST");

            String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");

            ManejadorRutas rutas = new ManejadorRutas(user, "POST");
            if (!rutas.existeAcceso(api + "." + funcionalidad, "POST"))
                return new BadRequestResult();

            string baseURL = rutas.getURL(api + "." + funcionalidad, "", "", "");
            Console.WriteLine("RutaBase= " + baseURL);

            return await RequestPostPutDeleteAsync(baseURL, "POST", bodyContent);

        }

        /// <summary>
        /// Metodo PUT general para la recepcion de solicitud de este tipo, se tiene el valor {api} y {funcionalidad} como el verbo del servicio que se va a consumir
        /// </summary>
        /// <param name="api">Verbo del nombre maquillado del servicio que se desea consumir</param>
        /// <param name="funcionalidad">Verbo del nombre maquillado de la funcionalidad del API que se desea consumir</param>
        /// <param name="bodyContent">Contenido del POST obtenido</param>
        /// <param name="value">valor que se estara agregando para concatenarlo en la URL</param>
        /// <returns>Retorna el resultado de la consulta correcta o fallida</returns>
        [HttpPut, Route("/grupo19/{api}/{funcionalidad}")]
        public async Task<IActionResult> UrlPut(String api, String funcionalidad, [FromBody] dynamic bodyContent)
        {
            DotNetEnv.Env.Load("../.env");

            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api + "/" + funcionalidad + "por metodo PUT");

            String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
            ManejadorRutas rutas = new ManejadorRutas(user, "PUT");
            if (!rutas.existeAcceso(api + "." + funcionalidad, "PUT"))
                return new BadRequestResult();

            string baseURL = rutas.getURL(api + "." + funcionalidad, "", "", "");
            Console.WriteLine("RutaBase= " + baseURL);

            return await RequestPostPutDeleteAsync(baseURL, "PUT", bodyContent);
        }

        /// <summary>
        /// Metodo DELETE general para la recepcion de solicitud de este tipo, se tiene el valor {api} y {funcionalidad} como el verbo del servicio que se va a consumir
        /// </summary>
        /// <param name="api">Verbo del nombre maquillado del servicio que se desea consumir</param>
        /// <param name="funcionalidad">Verbo del nombre maquillado de la funcionalidad del API que se desea consumir</param>
        /// <param name="bodyContent">Contenido del POST obtenido</param>
        /// <param name="value">valor que se estara agregando para concatenarlo en la URL</param>
        /// <returns>Retorna el resultado de la consulta correcta o fallida</returns>
        [HttpDelete, Route("/grupo19/{api}/{funcionalidad}/{value}")]
        public async Task<IActionResult> UrlDelete(String api, String funcionalidad, String value)
        {
            Console.WriteLine("");
            Console.WriteLine("Ingreso a " + api + "/" + funcionalidad + "/" + value + "por metodo DELETE");

            DotNetEnv.Env.Load("../.env");

            String user = DotNetEnv.Env.GetString("DB_USER_PROD", "esb_user");
            ManejadorRutas rutas = new ManejadorRutas(user, "DELETE");
            if (!rutas.existeAcceso(api + "." + funcionalidad, "DELETE"))
                return new BadRequestResult();

            string baseURL = rutas.getURL(api + "." + funcionalidad, value, "", "");
            Console.WriteLine("RutaBase= " + baseURL);

            return await RequestPostPutDeleteAsync(baseURL, "DELETE", "");
        }
    }
}

