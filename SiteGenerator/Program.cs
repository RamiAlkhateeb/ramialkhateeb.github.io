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
        // ... (Keep the File read and markdown HTML conversion parts exactly the same) ...

        // Replace your existing blogCardsBuilder.Append with this:
        blogCardsBuilder.Append($@"
        <a href='/blog/{entry.Slug}.html' class='saas-card blog-row'>
            <div class='blog-row-content'>
                <div class='lang-en-content'>
                    <h3>{entry.TitleEn}</h3>
                    <p>{entry.SummaryEn}</p>
                </div>
                <div class='lang-de-content'>
                    <h3>{entry.TitleDe}</h3>
                    <p>{entry.SummaryDe}</p>
                </div>
                <div class='lang-ar-content'>
                    <h3>{entry.TitleAr}</h3>
                    <p>{entry.SummaryAr}</p>
                </div>
            </div>
            <div style='text-align: right;'>
                <div class='blog-row-date'>{entry.Date}</div>
                <i class='fa-solid fa-arrow-right' style='color: var(--primary-color); margin-top: 8px;'></i>
            </div>
        </a>");
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
        // Replace your existing guidesCardsBuilder.Append with this:
        guidesCardsBuilder.Append($@"
        <div class='saas-card guide-card' style='display: flex; flex-direction: column; justify-content: space-between;'>
            <div>
                <div class='guide-image-wrapper'>
                    <img src='{guide.CoverImageUrl}' alt='Cover'>
                </div>
                <div class='lang-en-content'>
                    <h3 style='margin: 0 0 10px 0; font-size: 1.3rem; color: var(--primary-color);'>{guide.TitleEn}</h3>
                    <p style='color: var(--text-muted); font-size: 0.95rem;'>{guide.SummaryEn}</p>
                </div>
                <div class='lang-de-content'>
                    <h3 style='margin: 0 0 10px 0; font-size: 1.3rem; color: var(--primary-color);'>{guide.TitleDe}</h3>
                    <p style='color: var(--text-muted); font-size: 0.95rem;'>{guide.SummaryDe}</p>
                </div>
                <div class='lang-ar-content'>
                    <h3 style='margin: 0 0 10px 0; font-size: 1.3rem; color: var(--primary-color);'>{guide.TitleAr}</h3>
                    <p style='color: var(--text-muted); font-size: 0.95rem;'>{guide.SummaryAr}</p>
                </div>
            </div>
            <div style='margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;'>
                <span style='font-weight: 800; font-size: 1.4rem; color: var(--text-main);'>{guide.PriceLabel}</span>
                <a href='{guide.BuyLink}' class='btn-primary' data-gumroad-overlay-checkout='true'>
                    <span class='lang-en-content'>Buy <i class='fa-solid fa-cart-shopping'></i></span>
                    <span class='lang-de-content'>Kaufen <i class='fa-solid fa-cart-shopping'></i></span>
                    <span class='lang-ar-content'>شراء <i class='fa-solid fa-cart-shopping'></i></span>
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