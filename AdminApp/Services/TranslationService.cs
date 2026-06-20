using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace AdminApp.Services;

public class TranslationService
{
    private readonly HttpClient _http;

    public TranslationService(HttpClient http) => _http = http;

    public async Task<string> TranslateTextAsync(string text, string targetLanguage, string deepLKey)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api-free.deepl.com/v2/translate");
        request.Headers.Authorization = new AuthenticationHeaderValue("DeepL-Auth-Key", deepLKey);

        var data = new Dictionary<string, string>
        {
            { "text", text },
            { "target_lang", targetLanguage.ToUpper() },
            { "tag_handling", "html" } // Instructs DeepL to keep HTML formatting safely intact
        };

        request.Content = new FormUrlEncodedContent(data);
        var response = await _http.SendAsync(request);
        
        if (!response.IsSuccessStatusCode) return $"[Translation Failed: {response.ReasonPhrase}]";

        using var jsonDoc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return jsonDoc.RootElement.GetProperty("translations")[0].GetProperty("text").GetString() ?? string.Empty;
    }
}