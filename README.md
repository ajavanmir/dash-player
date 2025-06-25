# DASH Video Player - Adaptive Streaming Player

A responsive DASH video player with adaptive bitrate streaming and manual quality selection, built with dash.js.

## Features

- Adaptive Bitrate Streaming (ABR) with dash.js
- Manual quality selection (Low/Medium/High/Auto)
- Real-time quality and network status monitoring
- Responsive design with mobile support
- Multiple MPD fallback URLs
- Customizable UI with CSS variables
- Fullscreen quality optimization

## Installation

### Quick Start
1. Include dash.js in your project:
```html
<script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
```

2. Add the HTML structure:
```html
<div id="videoContainer">
    <video controls width="800" height="450" id="videoPlayer"></video>
    <div id="qualityControls">
        <div id="qualityInfo">Current Quality: <span id="currentQuality">Loading...</span></div>
        <div id="qualityButtons">
            <button id="autoQuality" data-res="auto">Automatic</button>
            <button id="lowQuality" data-res="low">Low quality</button>
            <button id="mediumQuality" data-res="medium">Average quality</button>
            <button id="highQuality" data-res="high">High quality</button>
        </div>
        <div id="availableQualities">Available qualities: <span id="qualityList">Loading...</span></div>
    </div>
    <div id="networkInfo">
        <div>Network status: <span id="networkStatus">Checking...</span></div>
    </div>
</div>
```

3. Include the CSS and JavaScript files.

## Configuration

### MPD Sources
Edit the `mpdUrls` array in `app.js` to add your DASH manifest URLs:
```javascript
let mpdUrls = [
    'https://your-first-stream.mpd',
    'https://your-fallback-stream.mpd'
];
```

### Customization
Modify the CSS variables in `style.css`:
```css
:root {
    --primary-color: #3498db;       /* Main theme color */
    --secondary-color: #2980b9;     /* Secondary color */
    --video-bg: #000;               /* Video background color */
    --active-button: #2ecc71;       /* Active button color */
    --border-radius: 6px;           /* UI element roundness */
}
```

## API Reference

### Player Methods
- `initPlayer()` - Initializes the DASH player
- `setQuality(qualityIndex)` - Sets playback quality (-1 for auto)
- `updateQualityInfo()` - Updates the quality display
- `updateAvailableQualities()` - Lists available bitrates

### Event Handlers
- `onMetadataLoaded` - Triggered when metadata is loaded
- `onQualityChanged` - Triggered when quality changes
- `onStreamInitialized` - Triggered when stream starts
- `onError` - Handles playback errors

## Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires MSE (Media Source Extensions) support
- Mobile browsers supported

## Troubleshooting
**Problem:** Video doesn't play  
**Solution:** Verify your MPD URL and CORS settings

**Problem:** Quality buttons not working  
**Solution:** Check if dash.js loaded correctly and the stream initialized

**Problem:** Mobile layout issues  
**Solution:** Ensure viewport meta tag is present and CSS media queries are correct
