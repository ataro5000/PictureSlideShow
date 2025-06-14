using Microsoft.AspNetCore.Mvc;
using PictureSlideShow.Models;
using System.Text.Json;

[ApiController]
[Route("api/pictures")]
public class PictureController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPictures()
    {
        try
        {
            // Path to the .txt file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "pictures.json");

            // Read the file content
            var jsonData = System.IO.File.ReadAllText(filePath);

            // Deserialize the JSON data into a list of Picture objects
            var pictures = JsonSerializer.Deserialize<List<Picture>>(jsonData);

            return Ok(pictures);
        }
        catch (Exception ex)
        {
            // Handle errors (e.g., file not found, invalid JSON)
            return StatusCode(500, $"Error loading pictures: {ex.Message}");
        }
    }
}