# LLMExt

LLMExt is a Chrome extension designed to extract and display webpage contents. It allows users to fetch the HTML content of the active tab and display it in a readable format. Additionally, it provides an interface to save API keys and other settings.

## Features

- Extract and display HTML content of the active tab.
- Save API keys and other settings using Chrome storage.
- Fetch data from an API and display the response.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/llmext.git
    cd llmext
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Build the project:
    ```sh
    npm run build
    ```

4. Load the extension in Chrome:
    - Open Chrome and navigate to [chrome://extensions/](http://_vscodecontentref_/0).
    - Enable "Developer mode" using the toggle switch in the top right corner.
    - Click "Load unpacked" and select the `llmext` directory.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. In the popup, click "Get Page Content" to fetch and display the HTML content of the active tab.
3. Enter your API key and other settings in the settings page and click "Save Settings".
4. Use the "Ask" button to fetch data from an API and display the response.

## Project Structure

- [background.js](http://_vscodecontentref_/1): Handles background tasks and listens for messages from the popup.
- [manifest.json](http://_vscodecontentref_/2): Configuration file for the Chrome extension.
- [popup.html](http://_vscodecontentref_/3): HTML file for the extension's popup interface.
- [settings.html](http://_vscodecontentref_/4): HTML file for the extension's settings page.
- [settings.js](http://_vscodecontentref_/5): JavaScript file for handling settings page interactions.
- [popup.js](http://_vscodecontentref_/6): JavaScript file for handling popup interactions.
- [styles.css](http://_vscodecontentref_/7): CSS file for styling the popup and settings pages.

## Scripts

- [npm run clean](http://_vscodecontentref_/9): Removes the [popup.js](http://_vscodecontentref_/10) file.
- `npm run build`: Bundles the [popup.js](http://_vscodecontentref_/11) file using esbuild.
- [npm run clean-build](http://_vscodecontentref_/12): Cleans and then builds the project.

## Dependencies

- [axios](http://_vscodecontentref_/13): Promise-based HTTP client for the browser and Node.js.
- [html-to-text](http://_vscodecontentref_/14): Converts HTML content to plain text.
- `babel-loader`: Webpack loader for transpiling JavaScript files using Babel.
- `esbuild`: An extremely fast JavaScript bundler.

## License

This project is licensed under the ISC License.
