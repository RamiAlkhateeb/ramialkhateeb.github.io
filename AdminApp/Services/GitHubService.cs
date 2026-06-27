using Octokit;
using System.Text;

namespace AdminApp.Services;

public class GitHubService
{
    private GitHubClient? _client;
    private string _owner = string.Empty;
    private string _repo  = string.Empty;

    public void Initialize(string token, string owner, string repo)
    {
        _owner = owner;
        _repo  = repo;
        _client = new GitHubClient(new ProductHeaderValue("PortfolioAdminSuite"))
        {
            Credentials = new Credentials(token)
        };
    }

    public bool IsConfigured => _client != null && !string.IsNullOrEmpty(_owner);

    public async Task<string> GetFileRawAsync(string path)
    {
        if (!IsConfigured) throw new Exception("GitHub client not initialized.");
        var contents = await _client!.Repository.Content.GetAllContents(_owner, _repo, path);
        var raw = contents.First().Content;
        // Octokit returns base64 for binary but text for small files; handle both
        try { return Encoding.UTF8.GetString(Convert.FromBase64String(raw)); }
        catch { return raw; }
    }

    public async Task SaveFileContentAsync(string path, string content, string commitMessage)
    {
        if (!IsConfigured) throw new Exception("GitHub client not initialized.");
        var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes(content));
        try
        {
            var existing = await _client!.Repository.Content.GetAllContents(_owner, _repo, path);
            var sha = existing.First().Sha;
            await _client.Repository.Content.UpdateFile(
                _owner, _repo, path,
                new UpdateFileRequest(commitMessage, encoded, sha));
        }
        catch (NotFoundException)
        {
            await _client!.Repository.Content.CreateFile(
                _owner, _repo, path,
                new CreateFileRequest(commitMessage, encoded));
        }
    }

    public async Task InjectBetweenMarkersAsync(
        string filePath,
        string startMarker,
        string endMarker,
        string newBlock,
        string commitMessage)
    {
        if (!IsConfigured) throw new Exception("GitHub client not initialized.");

        string html = await GetFileRawAsync(filePath);

        int startIdx = html.IndexOf(startMarker, StringComparison.Ordinal);
        int endIdx   = html.IndexOf(endMarker,   StringComparison.Ordinal);

        if (startIdx < 0 || endIdx < 0)
            throw new Exception($"Markers not found in {filePath}. Expected: {startMarker} and {endMarker}");

        int contentStart = startIdx + startMarker.Length;
        string before    = html[..contentStart];
        string after     = html[endIdx..];

        // Prepend new block so newest content appears first
        string updated = before + "\n" + newBlock + "\n" + after;

        await SaveFileContentAsync(filePath, updated, commitMessage);
    }
}