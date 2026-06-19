public class    BlogIndexEntry
{
    public string Slug { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string TitleDe { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string SummaryDe { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
}

public class BlogPost : BlogIndexEntry
{
    public string BodyEn { get; set; } = string.Empty; // Markdown text
    public string BodyDe { get; set; } = string.Empty; // Markdown text
}

public class GuideEntry
{
    public string Slug { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string TitleDe { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string SummaryDe { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string BuyLink { get; set; } = string.Empty;
    public string PriceLabel { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public string Date { get; set; } = string.Empty;
}