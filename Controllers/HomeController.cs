using Sketch.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.IO.Compression;
using Microsoft.AspNet.Identity;
using Amazon.S3;
using Amazon.S3.Model;
using Sketch.App_Start;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
namespace Sketch.Controllers
{
 
	public class HomeController : Controller
	{
		ChalkifiEntities1 datacontext = new ChalkifiEntities1 ();
		static IAmazonS3 client;

		static string bucketName = "elasticbeanstalk-us-east-1-815372684765";



        // Cloudinary Configuration

        Account account = new Account(
"bee",
"735534853732694",
"nBmtGS8LBjNof_LxAbXg_rYIbxc");

        Cloudinary cloudinary;
        public HomeController() {
            cloudinary = new Cloudinary(account);
        }
        public ActionResult New (string facebookId)
		{
			if (Session ["facebookId"] == null)
				Session ["facebookId"] = facebookId;
			if (Request.QueryString ["q1"] != null && Request.QueryString ["q4"] != null) {
				var room = new Board ();
				room.Name = Request.QueryString ["q1"];
				room.Description = Request.QueryString ["q4"];

				room.Instructor = Session ["facebookId"].ToString ();
				room.Finished = false;
				datacontext.Boards.Add (room);
				datacontext.SaveChanges ();
				ViewBag.Id = room.Id;
				return View ("Finished");
			}
     
			return View ();
		}

		public ActionResult CloseBoard (int room)
		{
			ChalkifiEntities1 dbcontext = new ChalkifiEntities1 ();

			var board = dbcontext.Boards.First (c => c.Id == room);
			board.Finished = true;
			board.AudioFile = "waiting";
			dbcontext.SaveChanges ();
			return RedirectToAction ("boardindex", "board"); 

		}

		public ActionResult Index ()
		{
			return View ();
		}

		public ActionResult Sketch (int room)
		{
			
			ViewBag.Room = room;
			return View ();
		}

		static byte[] Decompress (byte[] data)
		{
			using (var compressedStream = new MemoryStream (data))
			using (var zipStream = new GZipStream (compressedStream, CompressionMode.Decompress))
			using (var resultStream = new MemoryStream ()) {
				zipStream.CopyTo (resultStream);
				return resultStream.ToArray ();
			}
		}

		public JsonResult GetSampleLinks ()
		{
            List<string> urls = new List<string>();
           
            return Json (urls, JsonRequestBehavior.AllowGet);
		}
        public JsonResult UploadZipFileToCloudinary(string fileUrl, int room)
        {
           

            client = new AmazonS3Client("AKIAIHGEFKJFAROZAGRA", "8mqqW/yarKfvnmhRbCepAFkV3ffgE70LAritlIdP", Amazon.RegionEndpoint.USEast1);
            var results = "";
            var urls = new List<string>();

            try
            {

                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(fileUrl);

                HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
                var responseStream = resp.GetResponseStream();

                StreamReader sr = new StreamReader(responseStream);
                ZipArchive zipfile = new ZipArchive(responseStream);
                var guid = Guid.NewGuid();
                var dir = System.IO.Path.Combine(Server.MapPath("~/uploads"), Guid.NewGuid().ToString());
                zipfile.ExtractToDirectory(dir);
                var dirinfo = new DirectoryInfo(dir);
                foreach (var file in dirinfo.GetFiles()) {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.FullName)
                    };
                    var uploadResult = cloudinary.Upload(uploadParams);
                    urls.Add(uploadResult.Uri.AbsoluteUri);
                }

                results = sr.ReadToEnd();
                sr.Close();
            }
            catch (Exception ex)
            {
                urls.Add(ex.Message);

                urls.Add(ex.InnerException.StackTrace);
                urls.Add(ex.InnerException.HelpLink);
                urls.Add(ex.TargetSite.ToString());


                results = ex.Message;
            }


            return Json(urls, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UploadZipFile (string fileUrl, int room)
		{


            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(@"http://www.example.com/image.jpg")
            };
            var uploadResult = cloudinary.Upload(uploadParams);

            client = new AmazonS3Client ("AKIAIHGEFKJFAROZAGRA", "8mqqW/yarKfvnmhRbCepAFkV3ffgE70LAritlIdP", Amazon.RegionEndpoint.USEast1);
			var results = "";
			var urls = new List<string> ();

			try {

				HttpWebRequest req = (HttpWebRequest)WebRequest.Create (fileUrl);

				HttpWebResponse resp = (HttpWebResponse)req.GetResponse ();
				var responseStream = resp.GetResponseStream ();
               
				StreamReader sr = new StreamReader (responseStream);
				ZipArchive zipfile = new ZipArchive (responseStream);
               

				foreach (var photo in zipfile.Entries) {
					var uploadObj = new PutObjectRequest () {
						BucketName = bucketName,
						Key = "boards/" + room + "/" + photo.Name
					};

                   
					byte[] bytes;
					using (var ms = new MemoryStream ()) {
						var photostream = photo.Open ();
                       
						photostream.CopyTo (ms);
						uploadObj.InputStream = ms;
						bytes = ms.ToArray ();
						uploadObj.CannedACL = new S3CannedACL ("public-read");
						var putresponse = client.PutObject (uploadObj);
						var downloadLink = "https://" + bucketName + ".s3-accelerate.amazonaws.com/" + uploadObj.Key;

						urls.Add (downloadLink);
					}
					;
				}
                        
				results = sr.ReadToEnd ();
				sr.Close ();
			} catch (Exception ex) {
				urls.Add (ex.Message);
                
				urls.Add (ex.InnerException.StackTrace);
				urls.Add (ex.InnerException.HelpLink);
				urls.Add (ex.TargetSite.ToString ());
              

				results = ex.Message;
			}


			return Json (urls, JsonRequestBehavior.AllowGet);
		}
		//public ActionResult ImportPPT()
		//{foreach (string file in Request.Files)
		//{
		//    using (var client = new WebClient())
		//    {

		//        Console.WriteLine("Please choose a Word document to convert to PDF. All conversion will be done at http://www.convertapi.com server!");

		//        var fileToConvert = System.IO.Path.GetFileName(file.FileName);
		//        Console.WriteLine("Converting the file {0} Please wait.", fileToConvert);

		//        var data = new NameValueCollection();
		//        data.Add("OutputFormat", "jpg");
		//        data.Add("OutputFileName", System.IO.Path.GetFileNameWithoutExtension(file.FileName)); //Optional
		//        data.Add("ImageResolutionH", "150"); //Optional
		//        data.Add("ImageResolutionV", "150"); //Optional
		//        data.Add("OutputFileName", "MyFile"); //Optional

		//        //!!!MANDATORY!!!
		//        data.Add("ApiKey", "٣٠٤٧٦٦٣٢٠"); //API Key must be set if you purchased membership with credits. Please login to your control panel to find out your API Key http://www.convertapi.com/prices

		//        try
		//        {
		//            client.QueryString.Add(data);
		//            var response = client.UploadFile("http://do.convertapi.com/PowerPoint2Image", fileToConvert);
		//            var responseHeaders = client.ResponseHeaders;
		//            var path = System.IO.Path.Combine(@"C:\", responseHeaders["OutputFileName"]);
		//            System.IO.File.WriteAllBytes(path, response);
		//            Console.WriteLine("The conversion was successful! The word file {0} converted to PDF and saved at {1}", fileToConvert, path);
		//        }
		//        catch (WebException e)
		//        {
		//            Console.WriteLine("Exception Message :" + e.Message);
		//            if (e.Status == WebExceptionStatus.ProtocolError)
		//            {
		//                Console.WriteLine("Status Code : {0}", ((HttpWebResponse)e.Response).StatusCode);
		//                Console.WriteLine("Status Description : {0}", ((HttpWebResponse)e.Response).StatusDescription);
		//            }

		//        }

		//    }
		//    }
		//    return View();
		//}
        [GZipOrDeflate]
     
		public ActionResult Room (int room, bool main=false)
		{
			ViewBag.Room = room;
			//ChalkifiEntities1 dbcontext = new ChalkifiEntities1 ();
			//try {
			//	var board = dbcontext.Boards.First (c => c.Id == room);
			//	ViewBag.IsMain = (board.Instructor == User.Identity.GetUserId ());
			//	ViewBag.UserName = User.Identity.GetUserName ();
			//} catch {

				ViewBag.IsMain = main;
				ViewBag.UserName = "Guest" + Guid.NewGuid ().ToString ();

		//	}

			return View ();

		}

		 
       
		public ActionResult Board (int room, bool main)
		{
			ViewBag.Room = room;
			//ChalkifiEntities1 dbcontext = new ChalkifiEntities1 ();
			//try
   //         {
			//	var board = dbcontext.Boards.First (c => c.Id == room);
			//	ViewBag.IsMain = (board.Instructor == User.Identity.GetUserId ());
			//	ViewBag.UserName = User.Identity.GetUserName ();
			//}
   //         catch
   //         {

				ViewBag.IsMain =  main;
				ViewBag.UserName = "Guest" + Guid.NewGuid ().ToString ();

		//	}

			return View ();
		}

		public ActionResult Sketch2 (int room)
		{
			ViewBag.Room = room;
			return View ();
		}


		public ActionResult About ()
		{
			ViewBag.Message = "Your application description page.";

			return View ();
		}

		public ActionResult Contact ()
		{
			ViewBag.Message = "Your contact page.";

			return View ();
		}
	}
}