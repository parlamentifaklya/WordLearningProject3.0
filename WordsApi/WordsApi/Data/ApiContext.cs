using Microsoft.EntityFrameworkCore;
using WordsApi.Models;

namespace WordsApi.Data
{
    public class ApiContext : DbContext
    {
        public ApiContext(DbContextOptions<ApiContext> options) : base(options)
        {
            
        }
        public DbSet<Word> Words { get; set; }
    }
}
