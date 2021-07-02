
using System.Net.Http;
using System.Text;

namespace ESB.Clases
{
    public class ResultRequest
    {
        public string httpContent;
        public bool error;
        public string strError;

        public ResultRequest(string result, bool error, string exep)
        {
            this.httpContent = result;
            this.error = error;
            this.strError = exep;
        }
    }
}
