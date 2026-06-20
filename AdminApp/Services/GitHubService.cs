using System.Text.Json;
using Octokit;
using System.Net.Http; 

namespace AdminApp.Services;

public class GitHubService
{
    private GitHubClient? _client;
    private string _owner = string.Empty;
    private string _repo = string.Empty;

    public void Initialize(string token, string owner, string repo)
    {
        _owner = owner;
        _repo = repo;
        _client = new GitHubClient(new ProductHeaderValue("PortfolioAdminSuite"))
        {
            Credentials = new Credentials(token)
        };
    }

    public bool IsConfigured => _client != null && !string.IsNullOrEmpty(_owner);

    public async Task<string> GetFileRawAsync(string path)
    {
        if (!IsConfigured) throw new Exception("GitHub client is not initialized.");
        var contents = await _client!.Repository.Content.GetAllContents(_owner, _repo, path);
        return contents.First().Content;
    }

    public async Task SaveFileContentAsync(string path, string content, string commitMessage)
    {
        if (!IsConfigured) throw new Exception("GitHub client is not initialized.");

        try
        {
            var existingFile = await _client!.Repository.Content.GetAllContents(_owner, _repo, path);
            var sha = existingFile.First().Sha;
            await _client.Repository.Content.UpdateFile(_owner, _repo, path, new UpdateFileRequest(commitMessage, content, sha));
        }
        catch (NotFoundException)
        {
            await _client!.Repository.Content.CreateFile(_owner, _repo, path, new CreateFileRequest(commitMessage, content));
        }
    }

    public async Task TriggerWorkflowCompilerAsync()
{
    if (!IsConfigured || _client == null) return;

    var uri = new Uri($"https://api.github.com/repos/{_owner}/{_repo}/dispatches");

    var payload = new { event_type = "trigger-compiler" };
    var json = JsonSerializer.Serialize(payload);
    var httpContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

    using var http = new HttpClient();
    http.DefaultRequestHeaders.Add("Authorization", $"Bearer {_client.Credentials.Password}");
    http.DefaultRequestHeaders.Add("User-Agent", "PortfolioAdminSuite");
    http.DefaultRequestHeaders.Add("Accept", "application/vnd.github+json");

    await http.PostAsync(uri, httpContent);
}
}