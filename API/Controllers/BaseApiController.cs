using Microsoft.AspNetCore.Mvc; // For ApiController and ControllerBase attributes

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}