using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace ESB.Clases
{
    public class ConexionDB
    {
        private MySqlConnection con;
        private String conexionString;
        public ConexionDB(String connexion)
        {
            conexionString = connexion;
        }

        /// <summary>
        /// Clases principales para aperturar y cerrar la conexion para la conexion MySQL 
        /// </summary>

        #region CONEXIONES 

        public void openConexion()
        {
            try
            {
                con = new MySqlConnection(conexionString);
                if (con.State == ConnectionState.Closed)
                    con.Open();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void closeConexion()
        {
            if (con.State == ConnectionState.Open)
            {
                con.Close();
                con.Dispose();
                MySqlConnection.ClearAllPools();
            }
        }

        #endregion

        #region METODOS PARA ADMINISTRACION DE BASE DE DATOS
        /// <summary>
        /// Descripcion: Función que permite ejecutar un query dentro de la base de datos.
        /// </summary>
        /// <param name="query">
        /// Variable String que recibe el query a ejecutar.
        /// </param>
        /// <param name="db_base">
        /// Nombre de la base de datos en donde se correra el query
        /// </param>
        /// <returns> 
        ///     Retornará el id del insertado
        /// </returns>
        public bool execQuery(string query, string db_base)
        {
            try
            {
                openConexion();
                con.ChangeDatabase(db_base);
                MySqlCommand com = new MySqlCommand();
                com.Connection = con;
                com.CommandType = CommandType.Text;
                com.CommandText = query;
                int resultado = com.ExecuteNonQuery();
                closeConexion();
                if (resultado > 0) return true;
                return false;
            }
            catch (Exception ex)
            {
                closeConexion();
                throw ex;
            }
        }


        /// <summary>
        /// Descripcion: Función que permite obtener un DataTable mediante un query dentro de la base de datos.
        /// </summary>
        /// <param name="query">
        /// Variable String que recibe el query a ejecutar.
        /// </param>
        /// <param name="db_base">
        /// Nombre de la base de datos en donde se correra el query
        /// </param>  
        /// <returns>
        ///     Retornará un DataTable si el la ejecución del query encuentra datos o no tiene errores o retornará null si fuera lo contrario.
        /// </returns>
        public DataTable getTableByQuery(string query, string db_base)
        {
            try
            {
                DataTable dataTable = new DataTable();
                openConexion();
                con.ChangeDatabase(db_base);
                MySqlCommand com = new MySqlCommand();
                com.Connection = con;
                com.CommandType = CommandType.Text;
                com.CommandText = query;
                MySqlDataReader reader = com.ExecuteReader();
                dataTable.Load(reader);
                reader.Close();
                reader.Dispose();
                closeConexion();
                DataColumn[] columns;
                columns = dataTable.PrimaryKey;
                return dataTable;
            }
            catch (Exception ex)
            {
                closeConexion();
                throw ex;
            }
        }

        /// <summary>
        /// Descripcion: Función que permite obtener un Valor mediante un query dentro de la base de datos, por ejemplo un "Select Nombre From Hospital".
        /// </summary>
        /// <param name="query">
        /// Variable String que recibe el query a ejecutar.
        /// </param>
        /// <param name="db_base">
        /// Nombre de la base de datos en donde se correra el query
        /// </param>
        /// <returns>
        ///     Retornará un valor no parseado del valor que se haga la consulta si se encuentran datos o no se tuvieron errores, caso contrario se retonará el valor null.
        /// </returns>
        public object getSimpleSelect(string query, string db_base)
        {
            DataTable dato = getTableByQuery(query, db_base);
            if (dato.Rows.Count > 0)
            {
                foreach (DataRow row in dato.Rows)
                {
                    return row[0];
                }
            }
            return null;
        }

        #endregion


    }
}
