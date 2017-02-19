using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalRChat.Common;

namespace SignalRChat
{
    public class ChatHub : Hub
    {
        #region Data Members

        static Dictionary<string, List<UserDetail>> ConnectedUsers = new Dictionary<string, List<UserDetail>>();
        static Dictionary<string, List<MessageDetail>> CurrentMessage = new Dictionary<string, List<MessageDetail>>();

        #endregion

        #region Methods

        public void Connect(string userName , string room)
        {
            var id = Context.ConnectionId;

            if (!ConnectedUsers.ContainsKey(room))
            {
                ConnectedUsers.Add(room, new List<UserDetail>());
                CurrentMessage.Add(room, new List<MessageDetail>());
            }
            if (ConnectedUsers[room].Count(x => x.ConnectionId == id) == 0)
            {
                ConnectedUsers[room].Add(new UserDetail { ConnectionId = id, UserName = userName });

                // send to caller
                Clients.Caller.onConnected(id, userName, ConnectedUsers[room], CurrentMessage[room]);

                // send to all except caller client
                foreach (var user in ConnectedUsers[room])
                {
                    if (user.ConnectionId!=id)
                    Clients.Client(user.ConnectionId).onNewUserConnected(id, userName);
                }
                
            }

        }

        public void SendMessageToAll(string userName, string message , string room)
        {
            // store last 100 messages in cache
            AddMessageinCache(userName, message,room);
            foreach (var user in ConnectedUsers[room])
            {
                Clients.Client(user.ConnectionId).messageReceived(userName, message);
              
            }
            // Broad cast message
            //Clients.All.messageReceived(userName, message);
        }
        public void EndRoom(int roomId) {
            Sketch.ChalkifiEntities1 datacontext = new Sketch.ChalkifiEntities1();
            var room = datacontext.Boards.First(c => c.Id == roomId);
            room.Finished =true;
            datacontext.SaveChanges();
        
        }
        public void SendPrivateMessage(string toUserId, string message , string room)
        {

            string fromUserId = Context.ConnectionId;

            var toUser = ConnectedUsers[room].FirstOrDefault(x => x.ConnectionId == toUserId) ;
            var fromUser = ConnectedUsers[room].FirstOrDefault(x => x.ConnectionId == fromUserId);

            if (toUser != null && fromUser!=null)
            {
                // send to 
                Clients.Client(toUserId).sendPrivateMessage(fromUserId, fromUser.UserName, message); 

                // send to caller user
                Clients.Caller.sendPrivateMessage(toUserId, fromUser.UserName, message); 
            }

        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            var currentroom = "";
            UserDetail item = null;
            foreach (var room in ConnectedUsers.Keys) { 
            item = ConnectedUsers[room].FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)

                currentroom = room;
            }
            if (item != null)
            {
                ConnectedUsers[currentroom].Remove(item);

                var id = Context.ConnectionId;
                foreach (var user in ConnectedUsers[currentroom])
                {

                    Clients.Client(user.ConnectionId).onUserDisconnected(id, item.UserName);
                }
              //  Clients.All.onUserDisconnected(id, item.UserName);

            }

            return base.OnDisconnected();
        }

     
        #endregion

        #region private Messages

        private void AddMessageinCache(string userName, string message, string room)
        {
            if (CurrentMessage[room] == null)
                CurrentMessage[room] = new List<MessageDetail>();
            CurrentMessage[room].Add(new MessageDetail { UserName = userName, Message = message });

            if (CurrentMessage[room].Count > 100)
                CurrentMessage[room].RemoveAt(0);
        }

        #endregion
    }

}