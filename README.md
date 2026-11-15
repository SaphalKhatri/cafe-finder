☕ CafeFinder – Nearby Cafe & Restaurant Discovery

new Discover great food and coffee near you.

CafeFinder is a full-stack web application that helps users discover nearby cafes and restaurants based on their food and drink preferences.

Users can search for items such as Coffee, Pizza, Burger, Momos, Bakery, or multiple keywords like Coffee + Pizza. By sharing their current location, they can explore nearby restaurants with useful information such as ratings, addresses, reviews, distance, and directions.

The application uses the Google Places API to retrieve real-time place information without maintaining a restaurant database.

✨ Features
Food & Drink Search: Search for cafes and restaurants using food or drink keywords.
Multiple Keyword Search: Search for multiple items, such as Coffee + Pizza.
Current Location Detection: Find nearby restaurants using browser geolocation.
Restaurant Recommendations: View matching restaurants with available details.
Restaurant Images: Display restaurant photos when available.
Ratings & Reviews: View Google ratings and review counts when available.
Distance Information: See how far restaurants are from your current location.
Opening Status: Check whether a restaurant is open or closed when information is available.
Google Maps Directions: Navigate to restaurants using Google Maps.
Search Filters: Filter results by maximum distance, rating, and available restaurant categories.
Responsive Design: Works on desktop, tablet, and mobile devices.
No Database Required: Restaurant information is fetched dynamically from Google Places API.
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
CSS
Axios
Browser Geolocation API
Backend
Python
Django
Django REST Framework
Requests
External API
Google Places API (New)
Configuration
Environment variables (.env)
Git and GitHub
📁 Project Structure
text
CafeFinder/
│
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── places/
│   │   ├── __init__.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── .env
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

⚙️ Getting Started

Follow these instructions to run CafeFinder locally.

1. Clone the Repository
bash
git clone ""

cd CafeFinder

2. Backend Setup (Django)

Navigate to the backend directory:

bash
cd backend


Create a virtual environment:

bash
python -m venv venv


Activate the virtual environment.

Windows:

bash
venv\Scripts\activate


macOS / Linux:

bash
source venv/bin/activate


Install the dependencies:

bash
pip install -r requirements.txt


Create a .env file in the backend directory:

env
GOOGLE_PLACES_API_KEY=your_google_places_api_key


Replace the placeholder with your actual Google Places API key.

Run the Django development server:

bash
python manage.py runserver




3. Frontend Setup (React + TypeScript)

Open another terminal and navigate to the frontend directory:

bash
cd frontend


Install dependencies:

bash
npm install


Start the Vite development server:

bash
npm run dev




🔑 Google Places API Configuration

CafeFinder uses Google Places API (New) to retrieve nearby restaurants and cafes.

To configure the API:

Open Google Cloud Console.
Create or select a Google Cloud project.
Enable the Places API (New).
Set up billing for the project.
Generate an API key.
Store the API key in the backend .env file.

Important Security Notes:

Never expose your Google API key in React frontend code.
Never upload your .env file to GitHub.
Restrict your API key to the required API and appropriate server-side usage.
Keep your API key private.
🔄 How It Works

CafeFinder follows a simple client-server architecture.

text
           USER
             |
             v
     React + TypeScript
             |
             v
      Enter Food Keywords
             |
             v
       Share Location
             |
             v
      Axios API Request
             |
             v
       Django Backend
             |
             v
      Google Places API
             |
             v
       Process Results
             |
             v
       JSON Response
             |
             v
      React Frontend
             |
             v
    Restaurant Recommendation
           Cards

Search Workflow
The user enters one or more food or drink keywords.
The user clicks the Use My Location button.
The browser requests location permission.
React obtains the user's latitude and longitude.
React sends the search query and coordinates to Django.
Django communicates with Google Places API.
The backend processes and combines the results.
Duplicate restaurants are removed.
React displays the restaurant recommendations.

If location permission is denied, users can try again or use the manual location search option if configured.

🔌 API Endpoint

CafeFinder provides a Django REST API endpoint for restaurant searches.

Search Nearby Restaurants

Endpoint:

http
GET /api/places/search/


Example Request:

http
GET http://127.0.0.1:8000/api/places/search/?query=coffee&latitude=27.7172&longitude=85.3240


Query Parameters:

Parameter	Description
query	Food or drink search keyword
latitude	User's latitude
longitude	User's longitude

Example Response:

json
{
  "results": [
    {
      "id": "place_id_example",
      "name": "Example Coffee House",
      "address": "Kathmandu, Nepal",
      "rating": 4.5,
      "review_count": 120,
      "latitude": 27.7172,
      "longitude": 85.3240,
      "is_open": true,
      "photo_url": null,
      "distance": 1.2,
      "maps_url": "https://www.google.com/maps/search/?api=1&query=Example+Coffee+House"
    }
  ]
}


Note: The response above is an illustrative example. Actual fields depend on the information returned by Google Places API.

🎨 Design Philosophy

CafeFinder focuses on a clean, modern, and user-friendly experience.

Warm cream and coffee-inspired color palette.
Minimal and attractive interface.
Rounded search input and buttons.
Clean restaurant recommendation cards.
Responsive layouts for different screen sizes.
Simple hover interactions.
Clear loading, error, and empty-result states.

The goal is to make discovering nearby food and cafes simple and enjoyable.

🚀 Future Improvements

Possible improvements for future versions:

User authentication and personalized profiles.
Save favorite restaurants.
Search history.
Advanced restaurant filters.
Interactive Google Maps integration.
Restaurant reviews and recommendations.
More advanced food preference matching.
Deployment with a production-ready configuration.
🔒 Limitations
Restaurant information depends on Google Places API availability.
API usage may incur charges depending on Google Cloud pricing and usage.
Restaurant images and opening hours may not always be available.
Location accuracy depends on the user's device and browser.
Search results depend on Google's available place data.
The first version does not store restaurant information in a database.
👨‍💻 Developer

Developed as a Full-Stack Web Development Project

Technologies: React, TypeScript, Django, Django REST Framework, and Google Places API.

Project: CafeFinder
Category: Full-Stack Web Application
Purpose: Nearby Cafe & Restaurant Discovery

📄 License

This project is developed for educational and portfolio purposes.

You may modify and extend it for your own learning and development projects.s