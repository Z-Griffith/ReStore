// dimmed out because they are unnecessary, to remove them, use CTRL + .
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Product
    {
            /* input "prop" then the following is generated automatically
                accessor:

                - Public: this property inside this class can be accessed from any other class in our application
                It has to be Public because entity framework when we use that is going to come in and take a look at this class, 
                and it needs to be able to get the set whatever this property is.

                - Private: this property inside this class can be only accessed inside this particular class

                - Protected: this is only accessible from this class and any class that derives from this class

            */  
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description {get; set; }
            public long Price { get; set; } // A hundred will be stored as 10000 for adding decimal in the UI
            public string PictureUrl { get; set; }
            public string Type { get; set; }
            public string Brand { get; set; }
            public int QuantityInStock { get; set; }

    }
}