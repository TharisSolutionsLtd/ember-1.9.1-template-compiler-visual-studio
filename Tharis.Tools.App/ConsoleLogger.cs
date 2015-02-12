using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Tharis.Tools.App
{
    public static class Log
    {
        public enum Type
        {
            Success,
            Error
        }

        public static void FromWebResponse(Type type, WebResponse respose)
        {
            using (Stream stream = respose.GetResponseStream())
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    string message = "";

                    switch (type)
                    {
                        case (Type.Success):
                            message += "SUCCESS - \n";
                            break;
                        case (Type.Error):
                            message += "ERROR - \n";
                            break;
                        default:
                            message += "INFORMATION - \n";
                            break;
                    }

                    message += reader.ReadToEnd();

                    Console.WriteLine(message);
                }
            }
        }
    }
}
