namespace WordsApi.Models
{
    public class Word
    {
        public int Id { get; set; }
        public string? Hun { get; set; }
        public string? Eng { get; set; }
        public int SuccessCount { get; set; }
    }
}
