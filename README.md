

# PassSnap

PassSnap is a powerful yet simple Chrome extension designed to streamline your workflow by allowing you to effortlessly copy or reveal password fields on any webpage with just a single click.

## Features

- **Copy Passwords**: Easily copy passwords from hidden fields to your clipboard for quick and convenient access.
- **Reveal Passwords**: Instantly reveal masked password fields to view the actual passwords, making it easier to ensure you're entering the correct information.
- **Copy and Reveal**: Combine both functionalities to copy and reveal passwords simultaneously, providing ultimate flexibility.
- **Customizable Actions**: Choose between copying, revealing, or both, depending on your needs.
- **Disable for Specific Pages/Domains**: Disable the extension for specific pages or entire domains to ensure it works exactly where you need it.

## Installation

Clone the repository:
   ```bash
   git clone https://github.com/Ary428/PassSnap.git
   ```

### Installing and Building React

#### For Windows:

1. Ensure you have Node.js and npm installed. You can download them from [Node.js](https://nodejs.org/).

2. Open a Command Prompt and navigate to the project directory:
   ```cmd
   cd PassSnap
   ```

3. Run the following command:
   ```cmd
   cd react && npm install && npm run build && xcopy build\* ..\ /s /e /y && cd ..
   ```

#### For Linux and macOS:

1. Ensure you have Node.js and npm installed. You can download them from [Node.js](https://nodejs.org/).

2. Open a Terminal and navigate to the project directory:
   ```bash
   cd PassSnap
   ```

3. Run the following command:
   ```bash
   cd react && npm install && npm run build && cp -r build/* ../ && cd ..
   ```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" by clicking the toggle switch in the top right corner.
3. Click the "Load unpacked" button and select the root directory where you copied the build files.

## Usage

1. Click on the PassSnap icon in the Chrome toolbar to activate the extension.
2. Use the context menu (right-click) to copy or reveal passwords on any webpage.
3. Customize the extension settings through the options page to disable it for specific pages or domains if needed.

## Permissions

### activeTab
This permission allows PassSnap to access the current tab when the extension's browser action is clicked, enabling it to copy or reveal passwords as needed.

### storage
This permission is required to store user preferences within the extension, such as disabling it for specific pages or domains.

### tabs
This permission is necessary to keep track of the state of various tabs in the browser and to allow the extension to function in a customized manner on each tab.

### Host
This permission enables the extension to operate on specific domains, ensuring that PassSnap's functions work only on sites where password management is required.

### Remote Code Execution
Remote code may be used to update the extension or add new functionalities dynamically without requiring manual updates. All remote code complies with safety and privacy requirements.

## Contributing

We welcome contributions to improve PassSnap! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

PassSnap is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or feedback, please open an issue or contact us at [AryeBorgen@gmail.com](mailto:aryeborgen@gmail.com).
