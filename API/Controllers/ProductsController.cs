using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        // ctor - create a Constructor
        // In oder to use the dependency injection, we create a private field
       
        private readonly StoreContext _context;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(StoreContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            // var products = await context.Products.ToListAsync();
            // return Ok(products);
            return await _context.Products.ToListAsync();
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {

            _logger.LogInformation("Attempting to retrieve product with ID: {ProductId}", id);

            var product = await _context.Products.FindAsync(id);

            _logger.LogInformation("Product retrieved: {@Product}", product);

            if (product == null) return NotFound();

            return product;

        }

    }

    
}


