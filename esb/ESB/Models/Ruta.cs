using System;
using System.Collections.Generic;

namespace ESB.Models
{

    /// <summary>
    /// Clase principal para manejar las rutas con acceso del token ingresado, esta tendra su clave como viene en el scope del Token, su valor que será la URL a dirigirse y un listado de parametros si es que los tuviera para adjuntarlos en la URL
    /// </summary>
    public class Ruta
    {
        public String Scope { get; set; }
        public String Url { get; set; }
        public List<String> Parametros { get; set; }

        /// <summary>
        /// Contructor general de la clase
        /// </summary>
        /// <param name="clave">Clave proveniente del Scope del Token</param>
        /// <param name="valor">URL a la que se va a dirigir</param>
        /// <param name="parametros">Listado de parametros que pueda tener, si no tiene enviar un listado inicializado</param>
        public Ruta(String scope, String url, List<String> parametros)
        {
            Scope = scope;
            Url = url;
            Parametros = parametros;

            Console.WriteLine("RUTA AGREGADA --> scope= " + scope + " / URL = "+url);

        }

    }
}
