namespace Portfolio.Compiler.Models;

public class BlogIndexEntry
{
    public string Slug { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string TitleDe { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string SummaryDe { get; set; } = string.Empty;
    public string SummaryAr { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
}

public class BlogPost : BlogIndexEntry
{
    public string BodyEn { get; set; } = string.Empty; // Markdown or raw HTML from Substack
    public string BodyDe { get; set; } = string.Empty;
    public string BodyAr { get; set; } = string.Empty;
}

public class GuideEntry
{
    public string Slug { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string TitleDe { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;
    public string SummaryDe { get; set; } = string.Empty;
    public string SummaryAr { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string BuyLink { get; set; } = string.Empty;
    public string PriceLabel { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public string Date { get; set; } = string.Empty;
}