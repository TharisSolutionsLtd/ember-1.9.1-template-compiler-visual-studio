using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Tharis.Tools.App
{
    /// <summary>
    /// This is called automatically after the build event of this project when this project is referenced by another.
    /// Place <Exec Command="$(SolutionDir)\Tharis.Tools.App\bin\$(Configuration)\Tharis.Tools.App.exe $(ProjectDir)" /> in the BeforeBuild section of the project file.
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                string url = string.Format("http://localhost/Tharis.Tools.Node/app.js?dir={0}", args[0]);

                Console.WriteLine(string.Format("Performing tasks on project in location \"{0}\"", args[0]));

                try
                {
                    HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;

                    using (WebResponse respose = request.GetResponse())
                    {
                        Log.FromWebResponse(Log.Type.Success, respose);
                    }
                }
                catch (WebException ex)
                {
                    Log.FromWebResponse(Log.Type.Error, ex.Response);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR - \n" + ex.Message);
                }
            }
        }
    }
}
