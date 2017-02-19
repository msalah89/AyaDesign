 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sketch.Controllers
{
    public class RoomController : ApiController
    {
        // GET api/values
        
        public IEnumerable<Room> Get()
        {
            SketchEntities datacontext = new SketchEntities();
            List<Room> RoomList = new List<Room>();


            var rooms = datacontext.Room;
            foreach (var room in rooms)
            {

                var art = new Room() { Description = room.Description ?? "", Id = room.Id, Name= room.Name,  status= room.status, Facebook= room.Facebook};
                 RoomList.Add(art);
            }

            return RoomList.ToArray();
        }
        public IEnumerable<Room> GetRoom(int id)
        {
            SketchEntities datacontext = new SketchEntities();
            List<Room> RoomList = new List<Room>();


            var rooms = datacontext.Room.Where(c=>c.Id==id);
            foreach (var room in rooms)
            {

                var art = new Room() { Description = room.Description ?? "", Id = room.Id, Name = room.Name, status = room.status, Facebook = room.Facebook };
                RoomList.Add(art);
            }

            return RoomList.ToArray();
        
}
        public dynamic StartRoom(int id)
        {
            SketchEntities datacontext = new SketchEntities();
            var _room = datacontext.Room.First(c => c.Id == id);
            _room.status =1;
 
            datacontext.SaveChanges();
         
            return _room;
        }
        public dynamic EndRoom(int id)
        {
            SketchEntities datacontext = new SketchEntities();
            var _room = datacontext.Room.First(c => c.Id == id);
            _room.status = 2;

            datacontext.SaveChanges();
            List<Room> RoomList = new List<Room>();


            var rooms = datacontext.Room.Where(c => c.Id == id);
            foreach (var room in rooms)
            {

                var art = new Room() { Description = room.Description ?? "", Id = room.Id, Name = room.Name, status = room.status, Facebook = room.Facebook };
                RoomList.Add(art);
            }

            return RoomList.ToArray();
        }

        // POST api/values
        //public void Post(int id)
        //{
        //      CommentDatabaseEntities datacontext = new CommentDatabaseEntities();
        //      var users = datacontext.User.Where(c => c.facebook == _comment.CommentUser.userFacebook);
        //      User user = null;
        //      if (users.Any())
        //      {
        //          user = users.First();


        //      }
        //      else {
        //          user = new User();
        //          user.userName = _comment.CommentUser.userName;
        //          user.facebook = _comment.CommentUser.userFacebook;
        //          user.Avatar = _comment.CommentUser.userAvatar;
        //          datacontext.User.Add(user);
        //          datacontext.SaveChanges();
        //      }
        //    var comment = new Comment();
        //    comment.Message = _comment.Message;
        //    comment.userId =user.Id;
 
        //    comment.Room =(int) _comment.Room;
        //    datacontext.Comment.Add(comment);
        //    datacontext.SaveChanges();
        //}

        //// PUT api/values/5
        
        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}