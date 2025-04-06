import requests

# Base URL for the API
base_url = "https://api-sdp.stat.gov.pl/api/1.0.0/indicators/indicator-indicator?lang=pl"

# Example parameters (you can modify these)
# Replace 'en' with 'pl' for Polish language results
params = {
    "lang": "en",
    "version": "1.0.0"  # Replace with desired version if needed
}

# Optional: Set your API key if you have one (increases request limits)
# headers = {"X-ClientId": "YOUR_API_KEY"}

# Send the GET request
response = requests.get(base_url, params=params)

# Check for successful response
if response.status_code == 200:
    # Parse the JSON response (modify based on expected data format)
    print(response.text)
    # data = response.json()
    # print("API Response:")
    # # Print relevant parts of the data
    # print(data.get("publicationList", []))  # Example access for publications
else:
    print(f"Error: {response.status_code}")
    print(response.text)