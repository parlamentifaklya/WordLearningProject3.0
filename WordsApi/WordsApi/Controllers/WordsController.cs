using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WordsApi.Data;
using WordsApi.Models;

namespace WordsApi.Controllers
{
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WordsController : ControllerBase
    {
        private readonly ApiContext _context;
        public WordsController(ApiContext context)
        {
            _context = context;
        }

        [HttpPost]
        public JsonResult CreateEdit(Word word)
        {
            if (word.Id == 0)
            {
                _context.Words.Add(word);
            } else
            {
                var wordInDb = _context.Words.Find(word.Id);
                if (wordInDb == null)
                {
                    return new JsonResult(NotFound());
                }
                wordInDb = word;
            }
            _context.SaveChanges();
            return new JsonResult(Ok());
        }

        [HttpGet]
        public JsonResult Get(int id)
        {
            var result = _context.Words.Find(id);
            if (result == null)
            {
                return new JsonResult(NotFound());
            }
            else
            {
                return new JsonResult(Ok());
            }
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            var result = _context.Words.Find(id);
            if(result == null)
            {
                return new JsonResult(NotFound());
            }

            _context.Words.Remove(result);
            _context.SaveChanges();
            return new JsonResult(NoContent());
        }

        [HttpGet("/GetAll")]
        public JsonResult GetAll()
        {
            var result = _context.Words.ToList();
            return new JsonResult(Ok(result));
        }

        [HttpPost("bulk-insert")]
        public async Task<JsonResult> BulkInsert([FromBody] List<Word> words)
        {
            if (words == null || words.Count == 0)
            {
                return new JsonResult(new { message = "No data provided." })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }

            await _context.Words.AddRangeAsync(words);
            await _context.SaveChangesAsync();

            return new JsonResult(new { message = "Data inserted successfully."})
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
    }
}
