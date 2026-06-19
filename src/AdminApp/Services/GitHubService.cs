using System.Text.Json;
using Octokit;

namespace AdminApp.Services;

public class GitHubService
{
    private readonly string _owner = "YOUR_GITHUB_USERNAME"; // <-- Replace this
    private readonly string _repo = "YOUR_REPO_NAME";       // <-- Replace this
    private GitHubClient? _client;

    public void Initialize(string token)
    {
        _client = new GitHubClient(new ProductHeaderValue("PortfolioAdminApp"))
        {
            Credentials = new Credentials(token)
        };
    }

    public bool IsAuthenticated => _client != null;

    // Helper to fetch file content raw from repository
    public async Task<string> GetFileContentAsync(string path)
    {
        if (_client == null) throw new Exception("Not authenticated");
        var contents = await _client.Repository.Content.GetAllContents(_owner, _repo, path);
        return contents.First().Content;
    }

    // Helper to save or update file content via commit mutations
    public async Task SaveFileContentAsync(string path, string content, string commitMessage)
    {
        if (_client == null) throw new Exception("Not authenticated");

        try
        {
            // Try to find if file already exists to obtain its obligatory SHA checksum
            var existingFile = await _client.Repository.Content.GetAllContents(_owner, _repo, path);
            var sha = existingFile.First().Sha;

            await _client.Repository.Content.UpdateFile(_owner, _repo, path,
                new UpdateFileRequest(commitMessage, content, sha));
        }
        catch (NotFoundException)
        {
            // If file doesn't exist yet, issue a direct creation request instead
            await _client.Repository.Content.CreateFile(_owner, _repo, path,
                new CreateFileRequest(commitMessage, content));
        }
    }
}