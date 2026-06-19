using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using Markdig;

// Dynamically locate the repository root folder by searching upwards for index.html
var currentDir = new DirectoryInfo(AppContext.BaseDirectory);
while (currentDir != null && !File.Exists(Path.Combine(currentDir.FullName, "index.html")))
{
    currentDir = currentDir.Parent;
}

if (currentDir == null)
{
    throw new Exception("Could not find the repository root directory containing index.html!");
}

string rootPath = currentDir.FullName;

var contentPath = Path.Combine(rootPath, "content");
var templatesPath = Path.Combine(rootPath, "templates");

var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

Console.WriteLine("🚀 Compiling Static Assets...");

// --- 1. PROCESS SINGLE POST PAGES ---
var indexJson = File.ReadAllText(Path.Combine(contentPath, "blog", "index.json"));
var blogList = JsonSerializer.Deserialize<List<BlogIndexEntry>>(indexJson, jsonOptions) ?? new();

var singlePostTemplate = File.ReadAllText(Path.Combine(templatesPath, "single-post.html"));
Directory.CreateDirectory(Path.Combine(rootPath, "blog"));

var blogCardsBuilder = new StringBuilder();

foreach (var entry in blogList.Where(p => p.IsPublished).OrderByDescending(p => p.Date))
{
    Console.WriteLine($" -> Building Page: /blog/{entry.Slug}.html");
    var postJson = File.ReadAllText(Path.Combine(contentPath, "blog", $"{entry.Slug}.json"));
    var fullPost = JsonSerializer.Deserialize<BlogPost>(postJson, jsonOptions)!;

    string htmlBodyEn = Markdown.ToHtml(fullPost.BodyEn, pipeline);
    string htmlBodyDe = Markdown.ToHtml(fullPost.BodyDe, pipeline);

    string outputHtml = singlePostTemplate
        .Replace("{{PostTitleEn}}", fullPost.TitleEn)
        .Replace("{{PostTitleDe}}", fullPost.TitleDe)
        .Replace("{{PostDate}}", fullPost.Date)
        .Replace("{{PostBodyEn}}", htmlBodyEn)
        .Replace("{{PostBodyDe}}", htmlBodyDe);

    File.WriteAllText(Path.Combine(rootPath, "blog", $"{entry.Slug}.html"), outputHtml);

    // --- Generate Individual Timeline Snippet for main Archive Page ---
    blogCardsBuilder.Append($@"
    <div class='timeline-item'>
        <p class='timeline-date'><i class='fa-regular fa-calendar'></i> {entry.Date}</p>
        <div class='lang-en'>
            <h3 class='project-title'>{entry.TitleEn}</h3>
            <p class='project-desc'>{entry.SummaryEn}</p>
            <a href='/blog/{entry.Slug}.html' class='social-btn' style='margin-top:10px; display:inline-block;'>Read Article <i class='fa-solid fa-arrow-right'></i></a>
        </div>
        <div class='lang-de'>
            <h3 class='project-title'>{entry.TitleDe}</h3>
            <p class='project-desc'>{entry.SummaryDe}</p>
            <a href='/blog/{entry.Slug}.html' class='social-btn' style='margin-top:10px; display:inline-block;'>Artikel lesen <i class='fa-solid fa-arrow-right'></i></a>
        </div>
    </div>");
}

// Compile complete blog.html archive index file
string masterBlogListHtml = File.ReadAllText(Path.Combine(templatesPath, "blog-list.html"))
    .Replace("{{BlogCardsLoop}}", blogCardsBuilder.ToString());
File.WriteAllText(Path.Combine(rootPath, "blog.html"), masterBlogListHtml);


// --- 2. PROCESS GUIDES E-COMMERCE PAGE ---
var guidesJson = File.ReadAllText(Path.Combine(contentPath, "guides.json"));
var guidesList = JsonSerializer.Deserialize<List<GuideEntry>>(guidesJson, jsonOptions) ?? new();

var guidesCardsBuilder = new StringBuilder();

foreach (var guide in guidesList.Where(g => g.IsPublished).OrderByDescending(g => g.Date))
{
    Console.WriteLine($" -> Building Guide Element: {guide.Slug}");

    guidesCardsBuilder.Append($@"
    <div class='project-card' style='display: flex; flex-direction: column; justify-content: space-between;'>
        <div>
            <img src='{guide.CoverImageUrl}' alt='Cover' style='width:100%; border-radius:8px; margin-bottom:15px;'>
            <div class='lang-en'>
                <h3 class='project-title'>{guide.TitleEn}</h3>
                <p class='project-desc'>{guide.SummaryEn}</p>
            </div>
            <div class='lang-de'>
                <h3 class='project-title'>{guide.TitleDe}</h3>
                <p class='project-desc'>{guide.SummaryDe}</p>
            </div>
        </div>
        <div style='margin-top: 20px; display: flex; justify-content: space-between; align-items: center;'>
            <span class='timeline-date' style='font-weight: bold; font-size: 1.2rem;'>{guide.PriceLabel}</span>
            <a href='{guide.BuyLink}' class='social-btn' data-gumroad-overlay-checkout='true'>
                <span class='lang-en'>Buy Guide <i class='fa-solid fa-cart-shopping'></i></span>
                <span class='lang-de'>Kaufen <i class='fa-solid fa-cart-shopping'></i></span>
            </a>
        </div>
    </div>");
}

// Compile complete guides.html product listing file
string masterGuidesListHtml = File.ReadAllText(Path.Combine(templatesPath, "guides-list.html"))
    .Replace("{{GuidesCardsLoop}}", guidesCardsBuilder.ToString());
File.WriteAllText(Path.Combine(rootPath, "guides.html"), masterGuidesListHtml);

Console.WriteLine("✨ All static assets and compilation tasks complete!");