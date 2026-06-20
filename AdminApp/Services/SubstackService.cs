using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AdminApp.Services;

public class SubstackService
{
    private readonly HttpClient _http;

    public SubstackService(HttpClient http) => _http = http;

    public async Task<List<SubstackPost>> FetchAllPostsAsync(string substackSubdomain)
{
    string targetUrl = $"https://{substackSubdomain}.substack.com/api/v1/posts?limit=50";
    string proxiedUrl = $"https://corsproxy.io/?url={Uri.EscapeDataString(targetUrl)}";

    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var posts = await _http.GetFromJsonAsync<List<SubstackPost>>(proxiedUrl, options);

    return posts ?? new List<SubstackPost>();
}

    public async Task<SubstackPost?> FetchPostBySlugAsync(string substackSubdomain, string slug)
    {
        var posts = await FetchAllPostsAsync(substackSubdomain);
        return posts.FirstOrDefault(p => p.Slug == slug);
    }

    public string CleanBodyHtml(string html)
    {
        // Remove subscribe widgets entirely
        html = System.Text.RegularExpressions.Regex.Replace(
            html,
            @"<div class=""subscription-widget-wrap-editor"".*?</div>\s*</div>\s*</div>",
            "",
            System.Text.RegularExpressions.RegexOptions.Singleline);

        // Remove image expand/restack buttons inside figures
        html = System.Text.RegularExpressions.Regex.Replace(
            html,
            @"<div class=""image-link-expand"">.*?</div>\s*</div>",
            "",
            System.Text.RegularExpressions.RegexOptions.Singleline);

        return html.Trim();
    }
}

public class SubstackPost
{
    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("subtitle")]
    public string Subtitle { get; set; } = string.Empty;

    [JsonPropertyName("body_html")]
    public string BodyHtml { get; set; } = string.Empty;

    [JsonPropertyName("cover_image")]
    public string? CoverImage { get; set; }

    [JsonPropertyName("post_date")]
    public DateTime PostDate { get; set; }

    [JsonPropertyName("canonical_url")]
    public string CanonicalUrl { get; set; } = string.Empty;

    [JsonPropertyName("is_published")]
    public bool IsPublished { get; set; }
}