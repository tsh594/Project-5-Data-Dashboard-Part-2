# Web Development Project 6 - Global Weather Dashboard

Submitted by: **Tasneem Shabana**

This web app: **A responsive weather dashboard that displays current weather conditions, forecasts, and charts for cities around the world using data from OpenWeatherMap API.**

Time spent: **25** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
    - **Verified**: The `Dashboard.jsx` file includes a `WeatherCard` component for each city, and clicking on it navigates to the `DetailView` page using React Router.
  - Detail view includes extra information about the item not included in the dashboard view
    - **Verified**: The `DetailView.jsx` file displays additional details such as hourly and daily forecasts, charts, and background images.
  - The same sidebar is displayed in detail view as in dashboard view
    - **Verified**: The `Navigation.jsx` file ensures the sidebar is visible on all pages.
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
    - **Verified**: The sidebar is implemented and visible.

- [x] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  - **Verified**: The `DetailView.jsx` file uses React Router's `useParams` to fetch the city ID from the URL, ensuring each detail view has a unique URL.
  - *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*

- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
    - **Verified**: The `WeatherChart.jsx` file includes:
      - A temperature comparison chart (current temperature vs. feels-like temperature).
      - A humidity chart (humidity levels across different cities).
  - Each chart should describe a different aspect of the dataset
    - **Verified**: The charts provide insights into temperature and humidity trends.

## Optional Features

The following **optional** features are implemented:

- [x] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - **Verified**: The dashboard includes:
    - API call counters and statistics about the displayed data.
    - Visual indicators for different weather conditions.
- [x] The site allows users to toggle between different data visualizations
  - **Verified**: Users can toggle between different charts and visualizations in the `WeatherChart.jsx` file.

## Additional Features

The following **additional** features are implemented:

- [x] Dynamic background images based on location/continent
  - **Verified**: The `fetchBackgroundImage` function in `App.jsx` fetches images from the Pexels API based on the city name.
- [x] Rate limiting indicators for API calls
  - **Verified**: The `fetchWeather` function in `App.jsx` includes rate-limiting logic to prevent exceeding the OpenWeatherMap API limits.
- [x] Responsive design that works on mobile devices
  - **Verified**: The `index.css` file includes responsive styles for charts, cards, and the sidebar.
- [] Recent search history with localStorage persistence
  - **Verified**: The `SearchBar.jsx` file saves recent searches to `localStorage` and displays them as suggestions.
- [x] Animated weather icons for different conditions
  - **Verified**: The `WeatherCard.jsx` file uses `react-icons/wi` to display animated weather icons based on the weather condition.
- [x] Parallax scrolling effect for background images
  - **Verified**: The `DetailView.jsx` file applies a parallax effect to the background image using CSS.
- [x] Fallback images for cities without background images
  - **Verified**: The `fetchBackgroundImage` function includes a fallback image URL.
- [x] Filters for temperature range, wind speed, and weather conditions
  - **Verified**: The `Dashboard.jsx` file includes filters for temperature range, wind speed, and weather conditions.
- [x] Support for up to 30 cities on the dashboard
  - **Verified**: The `Dashboard.jsx` file limits the displayed cities to 30.
- [x] Dynamic weather statistics (e.g., average, minimum, and maximum temperatures)
  - **Verified**: The `Dashboard.jsx` file calculates and displays average, minimum, and maximum temperatures.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='videos/Vite+React-Weather-App-Desktop.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
(1). Game Bar
(2). Cloud Convertor (https://cloudconvert.com/mp4-to-gif)
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## GitHub Repository

The source code for this project is available on GitHub:  
[https://github.com/tsh594/Project-5-Data-Dashboard-Part-2.git](https://github.com/tsh594/Project-5-Data-Dashboard-Part-2.git)

## Notes

### Challenges Encountered:
- **API Rate Limits**:
  - Implementing rate limiting for API calls to stay within the free tier limits of OpenWeatherMap.
- **Responsive Design**:
  - Ensuring charts and cards are readable and functional on smaller screens.
- **Error Handling**:
  - Handling errors from multiple API sources (e.g., OpenWeatherMap, Pexels) gracefully.
- **Dynamic Backgrounds**:
  - Fetching and displaying dynamic background images for cities while ensuring fallback images are used when necessary.
- **Timezone Handling**:
  - Displaying sunrise and sunset times in the correct format without unnecessary conversions.

## License

    Copyright 2025 Tasneem Shabana

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.