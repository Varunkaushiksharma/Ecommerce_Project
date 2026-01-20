package com.example.springboot1.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "*")
public class WikiController {
    

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();


          // Helper method to call Wikipedia API with User-Agent
    private String fetchWithUserAgent(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "VarunWikiApp/1.0 (contact: your_email@example.com)");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );
        return response.getBody();
    }
       

       
    // Fetch only the main article for the query
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q) {
        try {
            // Step 1: Search articles using MediaWiki Action API
            String searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=" + q;
            String searchResponse = fetchWithUserAgent(searchUrl);
            JsonNode searchJson = mapper.readTree(searchResponse);

            JsonNode firstItem = searchJson.path("query").path("search").get(0);
            if (firstItem == null) {
                return ResponseEntity.ok(Map.of("results", List.of()));
            }

            String title = firstItem.path("title").asText();
            String cleanTitle = title.replace(" ", "_");

            // Step 2: Fetch summary for the first result only
            String summaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" + cleanTitle;
            String summaryResponse = fetchWithUserAgent(summaryUrl);
            JsonNode summaryJson = mapper.readTree(summaryResponse);

            Map<String, Object> result = new HashMap<>();
            result.put("title", summaryJson.path("title").asText());
            result.put("description", summaryJson.path("description").asText(null));
            result.put("summary", summaryJson.path("extract").asText(null));
            result.put("thumbnail", summaryJson.path("thumbnail").path("source").asText(null));
            result.put("pageUrl", summaryJson.path("content_urls").path("desktop").path("page").asText(null));

            return ResponseEntity.ok(Map.of("results", List.of(result)));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong", "details", e.getMessage()));
        }
    }

}


