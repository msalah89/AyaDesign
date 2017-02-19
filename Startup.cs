using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Sketch.Startup))]
namespace Sketch
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
             
            ConfigureAuth(app);
        }
    }
}
