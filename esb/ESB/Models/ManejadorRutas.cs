using ESB.Clases;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace ESB.Models
{
    /// <summary>
    /// Clase para la gestion de las rutas que se tienen acceso, se valida mediante la conexion de base de datos y su metodo a comsuimir (POST, GET, DELETE o PUT) y principalmente mediante el token.
    /// </summary>
    public class ManejadorRutas
    {
        private List<Ruta> rutas;
        private ConexionDB conn;

        /// <summary>
        /// Constructor general de la clase
        /// </summary>
        /// <param name="tagConexion">Tag de conexion para aperturar la conexión a la base de datos</param>
        /// <param name="metodo">Valor de POST, GET, DELETE o PUT</param>
        public ManejadorRutas(String tagConexion,String metodo)
        {
            conn = new ConexionDB(tagConexion);
            CargarRutas(metodo);
        }

        /// <summary>
        /// Metodo privado que se encarga de analizar el token y obtener los scopes a los cuales tiene accesos, y mediante esto se hara la carga de los mismos y se mantendrán en memoria
        /// </summary>
        /// <param name="metodo">Valor de POST, GET, DELETE o PUT</param>
        private void CargarRutas(String metodo)
        {
            rutas = new List<Ruta>();
            DataTable tableRutas = conn.getTableByQuery("select Llave,Ruta,RutaId from Ruta where Tipo='" + metodo+"' and status = 'ACTIVO';", "esb");
            foreach(DataRow row in tableRutas.Rows)
            {
                List<String> parametros = new List<string>();
                DataTable tableParametros = conn.getTableByQuery("select Nombre from RutaParametro where status = 'ACTIVO' and RutaId=" + row[2].ToString() + ";", "esb");
                foreach (DataRow param in tableParametros.Rows)
                {
                    parametros.Add(param[0].ToString());
                }

                rutas.Add(new Ruta(row[0].ToString(), row[1].ToString(), parametros));
            }
        }

        /// <summary>
        /// Metodo bool que determina que la URL a la que se está accediente esté dentro del listado de rutas que se cargaron previamente
        /// </summary>
        /// <param name="llave">llave armanda con la ULR recibida en el Controlador</param>
        /// <param name="method">Metodo GET,POST,PUT o DELETE</param>
        /// <returns>Retorna un true si existe el acceso y false si no lo tenemos</returns>
        public bool existeAcceso(String llave, String method)
        {
            Console.WriteLine("Validando Acceso de la Ruta '" + llave);
            Console.WriteLine("Accediendo por metodo '" + method);

            foreach (Ruta ruta in rutas)
            {
                String scope = ruta.Scope.ToLower();
                Console.WriteLine("Scope --> " + ruta.Scope);
                Console.WriteLine("Ruta  --> " + ruta.Url);

                if (scope.ToLower().EndsWith(".post") && method == "POST")
                    scope = scope.Replace(".post", "");
                else if (scope.ToLower().EndsWith(".get") && method == "GET")
                    scope = scope.Replace(".get", "");
                else if (scope.ToLower().EndsWith(".put") && method == "PUT")
                    scope = scope.Replace(".put", "");
                else if (scope.ToLower().EndsWith(".delete") && method == "DELETE")
                    scope = scope.Replace(".delete", "");

                if (scope.Equals(llave.ToLower()))
                {
                    Console.WriteLine("Escope encontrado " + scope);
                    return true;
                }
            }
            Console.WriteLine("Escope no encontrado " + llave);
            return false;
        }

        /// <summary>
        /// Metodo String que retorna la URL de la llave que se tenga, recibe 3 parametros y la arma segun sea la necesidad
        /// </summary>
        /// <param name="llave">llave armanda con la ULR recibida en el Controlador</param>
        /// <param name="parametro1">Valor del parametro 1, si no se tiene enviar vacio o null</param>
        /// <param name="parametro2">Valor del parametro 2, si no se tiene enviar vacio o null</param>
        /// <param name="parametro3">Valor del parametro 3, si no se tiene enviar vacio o null</param>
        /// <returns>String con la ULR ya armada</returns>
        public String getURL(String llave,String parametro1, String parametro2, String parametro3)
        {
            foreach (Ruta ruta in rutas)
            {
                int parametros = 0;
                if (parametro1 != "" && parametro1 != null)
                    parametros += 1;

                if (parametro2 != "" && parametro2 != null)
                    parametros += 1;

                if (parametro3 != "" && parametro3 != null)
                    parametros += 1;

                if (ruta.Scope.Equals(llave) && ruta.Parametros.Count==parametros)
                {
                    if (ruta.Parametros.Count > 0)
                    {
                        if (ruta.Parametros.Count == 1)
                        {
                            return ruta.Url.Replace(":" + ruta.Parametros[0], parametro1);
                        }
                        else if (ruta.Parametros.Count == 2)
                        {
                            return ruta.Url.Replace(":" + ruta.Parametros[0], parametro1).Replace(":" + ruta.Parametros[1], parametro2);
                        }
                        else if (ruta.Parametros.Count == 3)
                        {
                            return ruta.Url.Replace(":" + ruta.Parametros[0], parametro1).Replace(":" + ruta.Parametros[1], parametro2).Replace(":" + ruta.Parametros[2], parametro3);
                        }
                    }
                    else
                        return ruta.Url;
                }
                    
            }

            return "";
        }

    }
}
