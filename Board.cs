//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Sketch
{
    using System;
    using System.Collections.Generic;
    
    public partial class Board
    {
        public int Id { get; set; }
        public Nullable<int> Duration { get; set; }
        public Nullable<System.DateTime> startdate { get; set; }
        public string Instructor { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string BoardFile { get; set; }
        public string AudioFile { get; set; }
        public Nullable<bool> Finished { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
    }
}
