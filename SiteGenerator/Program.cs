using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using Markdig;
using Portfolio.Compiler.Models;

Console.WriteLine("🚀 Launching Static Site Compiler...");

// 1. Resolve repository root from AppDomain base path and fallback explicitly
var baseDir = AppDomain.CurrentDomain.BaseDirectory;
string rootPath = Path.GetFullPath(baseDir);

if (!File.Exists(Path.Combine(rootPath, "index.html")))
{
    var candidateRoot = Path.GetFullPath(Path.Combine(baseDir, "..", "..", "..", ".."));
    if (File.Exists(Path.Combine(candidateRoot, "index.html")))
    {
        rootPath = candidateRoot;
    }
    else
    {
        rootPath = Directory.GetCurrentDirectory();
        if (!File.Exists(Path.Combine(rootPath, "index.html")))
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"⚠️ Warning: Could not locate index.html from AppDomain.BaseDirectory; falling back to current working directory: {rootPath}");
            Console.ResetColor();
        }
    }
}

string contentPath = Path.Combine(rootPath, "content");
string templatesPath = Path.Combine(rootPath, "templates");
string blogOutputDir = Path.Combine(rootPath, "blog");

// Load shared header partial
string headerPartialPath = Path.Combine(templatesPath, "header.html");
string headerHtml = File.Exists(headerPartialPath)
    ? File.ReadAllText(headerPartialPath)
    : "<!-- header partial missing -->";

// Ensure output subdirectories exist
Directory.CreateDirectory(blogOutputDir);

var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
var markdownPipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();

// --- TASK 1: COMPILE SINGLE BLOG ARTICLES & CHRONOLOGICAL ARCHIVE ---
string blogIndexFile = Path.Combine(contentPath, "blog", "index.json");
if (File.Exists(blogIndexFile))
{
    Console.WriteLine("Processing Blog Entries...");
    string indexJson = File.ReadAllText(blogIndexFile);
    var blogList = JsonSerializer.Deserialize<List<BlogIndexEntry>>(indexJson, jsonOptions) ?? new();
    
    var blogCardsBuilder = new StringBuilder();
    string singlePostTemplate = File.ReadAllText(Path.Combine(templatesPath, "single-post.html"));

    foreach (var entry in blogList.Where(p => p.IsPublished).OrderByDescending(p => p.Date))
    {
        string fullPostFile = Path.Combine(contentPath, "blog", "posts", $"{entry.Slug}.json");
        if (!File.Exists(fullPostFile)) continue;

        string postJson = File.ReadAllText(fullPostFile);
        var fullPost = JsonSerializer.Deserialize<BlogPost>(postJson, jsonOptions)!;

        // Convert individual text languages from Markdown to structural HTML
        string htmlEn = Markdown.ToHtml(fullPost.BodyEn, markdownPipeline);
        string htmlDe = Markdown.ToHtml(fullPost.BodyDe, markdownPipeline);
        string htmlAr = Markdown.ToHtml(fullPost.BodyAr, markdownPipeline);

        // Inject page values into tokens
        string singlePostHtml = singlePostTemplate
            .Replace("{{HEADER}}", headerHtml)
            .Replace("{{PostTitleEn}}", fullPost.TitleEn)
            .Replace("{{PostTitleDe}}", fullPost.TitleDe)
            .Replace("{{PostTitleAr}}", fullPost.TitleAr)
            .Replace("{{PostSummaryEn}}", fullPost.SummaryEn)
            .Replace("{{PostSummaryDe}}", fullPost.SummaryDe)
            .Replace("{{PostSummaryAr}}", fullPost.SummaryAr)
            .Replace("{{PostDate}}", fullPost.Date)
            .Replace("{{PostBodyEn}}", htmlEn)
            .Replace("{{PostBodyDe}}", htmlDe)
            .Replace("{{PostBodyAr}}", htmlAr);

        File.WriteAllText(Path.Combine(blogOutputDir, $"{entry.Slug}.html"), singlePostHtml);
        Console.WriteLine($" -> Generated: /blog/{entry.Slug}.html");

        // Append card snippet row to the master archive loop using visibility classes
        blogCardsBuilder.Append($@"
        <div class='timeline-item'>
            <p class='timeline-date'><i class='fa-regular fa-calendar'></i> {entry.Date}</p>
            <div class='lang-en-content'>
                <h3 class='project-title'>{entry.TitleEn}</h3>
                <p class='project-desc'>{entry.SummaryEn}</p>
                <a href='/blog/{entry.Slug}.html' class='social-btn' style='margin-top:10px; display:inline-block;'>Read Article <i class='fa-solid fa-arrow-right'></i></a>
            </div>
            <div class='lang-de-content'>
                <h3 class='project-title'>{entry.TitleDe}</h3>
                <p class='project-desc'>{entry.SummaryDe}</p>
                <a href='/blog/{entry.Slug}.html' class='social-btn' style='margin-top:10px; display:inline-block;'>Artikel lesen <i class='fa-solid fa-arrow-right'></i></a>
            </div>
            <div class='lang-ar-content'>
                <h3 class='project-title'>{entry.TitleAr}</h3>
                <p class='project-desc'>{entry.SummaryAr}</p>
                <a href='/blog/{entry.Slug}.html' class='social-btn' style='margin-top:10px; display:inline-block;'>اقرأ المقال <i class='fa-solid fa-arrow-left'></i></a>
            </div>
        </div>");
    }

    // Output main blog.html listing page
    string blogListTemplate = File.ReadAllText(Path.Combine(templatesPath, "blog-list.html"));
    File.WriteAllText(
        Path.Combine(rootPath, "blog.html"),
        blogListTemplate
            .Replace("{{HEADER}}", headerHtml)
            .Replace("{{BlogCardsLoop}}", blogCardsBuilder.ToString())
    );
    Console.WriteLine(" -> Generated: /blog.html");
}

// --- TASK 2: COMPILE PREMIUM GUIDES DIRECTORY ---
string guidesFile = Path.Combine(contentPath, "guides.json");
if (File.Exists(guidesFile))
{
    Console.WriteLine("Processing Digital Guides...");
    string guidesJson = File.ReadAllText(guidesFile);
    var guidesList = JsonSerializer.Deserialize<List<GuideEntry>>(guidesJson, jsonOptions) ?? new();

    var guidesCardsBuilder = new StringBuilder();

    foreach (var guide in guidesList.Where(g => g.IsPublished).OrderByDescending(g => g.Date))
    {
        guidesCardsBuilder.Append($@"
        <div class='project-card' style='display: flex; flex-direction: column; justify-content: space-between;'>
            <div>
                <img src='{guide.CoverImageUrl}' alt='Cover' style='width:100%; border-radius:8px; margin-bottom:15px;'>
                <div class='lang-en-content'>
                    <h3 class='project-title'>{guide.TitleEn}</h3>
                    <p class='project-desc'>{guide.SummaryEn}</p>
                </div>
                <div class='lang-de-content'>
                    <h3 class='project-title'>{guide.TitleDe}</h3>
                    <p class='project-desc'>{guide.SummaryDe}</p>
                </div>
                <div class='lang-ar-content'>
                    <h3 class='project-title'>{guide.TitleAr}</h3>
                    <p class='project-desc'>{guide.SummaryAr}</p>
                </div>
            </div>
            <div style='margin-top: 20px; display: flex; justify-content: space-between; align-items: center;'>
                <span class='timeline-date' style='font-weight: bold; font-size: 1.2rem;'>{guide.PriceLabel}</span>
                <a href='{guide.BuyLink}' class='social-btn' data-gumroad-overlay-checkout='true'>
                    <span class='lang-en-content'>Buy Guide <i class='fa-solid fa-cart-shopping'></i></span>
                    <span class='lang-de-content'>Kaufen <i class='fa-solid fa-cart-shopping'></i></span>
                    <span class='lang-ar-content'>شراء الدليل <i class='fa-solid fa-cart-shopping'></i></span>
                </a>
            </div>
        </div>");
    }

    string guidesListTemplate = File.ReadAllText(Path.Combine(templatesPath, "guides-list.html"));
    File.WriteAllText(
        Path.Combine(rootPath, "guides.html"),
        guidesListTemplate
            .Replace("{{HEADER}}", headerHtml)
            .Replace("{{GuidesCardsLoop}}", guidesCardsBuilder.ToString())
    );
    Console.WriteLine(" -> Generated: /guides.html");
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("✨ Static Build Compilation Cycle Complete!");
Console.ResetColor();