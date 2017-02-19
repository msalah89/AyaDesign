using System.Web;
using System.Web.Optimization;

namespace Sketch
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/boardbundle").Include(
                        "~/Content/chalkifiassetes/js/bootstrap/bootstrap.min.js",
                        "~/Content/chalkifiassetes/js/myjs.js",
                        "~/Scripts/json-patch-duplex.min.js",
                        "~/Scripts/linq.min.js",
                        "~/Scripts/aws-sdk-2.3.8.min.js",
"~/Scripts/knockout-2.2.0.js"
                        ,

                        "~/Scripts/Chat.js",
                        "~/Scripts/convertpptpdf.js")); 
            bundles.Add(new ScriptBundle("~/bundles/roombundle").Include(
                                   "~/content/assets/js/bootstrap/bootstrap.min.js",

                                   "~/Scripts/json-patch-duplex.min.js",
                                   "~/Scripts/linq.min.js",
                                   "~/Scripts/aws-sdk-2.3.8.min.js",
          "~/Content/colorpicker/jquery.tinycolorpicker.js",

                                   "~/Scripts/Chat.js",
                                   "~/Scripts/convertpptpdf.js"));

            bundles.Add(new ScriptBundle("~/bundles/board").Include("~/Scripts/base64-string.js", "~/Scripts/BSON.min.js", "~/Scripts/lz-string-1.0.2.js", "~/Scripts/fabric.min.js", "~/FabricBoard.js"));
            bundles.Add(new ScriptBundle("~/bundles/roomboard").Include("~/Scripts/base64-string.js", "~/Scripts/lz-string-1.0.2.js", "~/Scripts/fabric.min.js", "~/RoomBoard.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
            bundles.Add(new StyleBundle("~/boardstyle/css").Include(
                                  "~/content/assets/css/bootstrap/css/bootstrap.min.css",
                                  "~/Content/rtc/stylesheets/style.css",
                                  "~/content/assets/Blueprint-SlidePushMenus-master/css/component.css",
                                  "~/content/assets/Blueprint-SlidePushMenus-master/css/default.css",
                                  "~/content/assets/css/mystyle.css",
                                  "~/Content/TooltipStylesInspiration/css/normalize.css",
                                  "~/Content/TooltipStylesInspiration/css/tooltip-bloated.css",
                                  "~/Css/ChatStyle.css",
                                  "~/Css/JQueryUI/themes/base/jquery.ui.all.css"

                                  ));

            bundles.Add(new StyleBundle("~/roomstyle/css").Include(
                "~/Content/chalkifiassetes/css/tabs/normalize.css",
                "~/Content/chalkifiassetes/css/tabs/tabs.css",
                "~/Content/chalkifiassetes/css/board.css",
                "~/Content/chalkifiassetes/js/tabs/modernizr.custom.js",
                "~/Content/colorpicker/tinycolorpicker.css"
                

                                              ));



                BundleTable.EnableOptimizations = true;
        
        }
    }
}
