# 1. Introduction

Welcome to the official documentation for the **Admin Dashboard UI**. This document provides a comprehensive guide on how to setup, build, and design demos using our platform.

---

# 2. Setup Demo

Before you can generate a demo link, you must ensure that your environment and assets are correctly prepared.

### 2.1 Asset Preparation

1.  **File Formats**: Ensure your creatives are in valid formats (JPG, PNG, MP4, or HTML5 Zip).
2.  **Naming Convention**: It is recommended to use lowercase with hyphens (e.g., `brand-campaign-300x250.jpg`).

### 2.2 Uploading Assets

1.  Navigate to the **Upload Demo** page via the sidebar.
2.  Drag and drop your files into the upload zone or click "Browse files".
3.  Verify that the files appear in the **File Manager** list below the upload area.
4.  Ensure file permissions are set to `read` for the CDN user.

---

# 3. Build Demo

The **Build Demo** page is the core tool for generating preview links for your clients.

### 3.1 Configuration Steps

1.  **Ad View**: Select the target device (Mobile, Desktop, or Tablet).
2.  **Template**: Choose a pre-defined layout (Standard, Premium, etc.).
3.  **Ad Format**: Select the specific ad behavior (e.g., _In-Page_, _First View_, _Interstitial_).
4.  **Logo**: Optionally attach a brand logo to the demo header.

### 3.2 Generating the Link

1.  Select the environment **Source** (Demo, Stage, or Prod).
2.  Enter the specific campaign ID or source path in the input field.
3.  Click **SUBMIT**.
4.  The system will generate a unique URL in the output text area.
5.  Use the **Copy** or **Open in New Tab** buttons to test the link.

---

# 4. Design Demo

The Design phase ensures that the ad renders correctly across different resolutions and matches the client's branding.

### 4.1 Template Preview

- On the right side of the **Build Demo** page, a **Template Preview** panel shows a static representation of the selected layout.
- Use this to verify that the Logo and Ad Format combination looks aesthetically pleasing before sending it to the client.

### 4.2 Customization

For advanced customization:

- **Aspect Ratio**: Ensure the creative assets match the selected aspect ratio in the settings.
- **Backgrounds**: Some templates support custom background colors which can be defined in the optional settings menu (if enabled).

---

# 5. FAQ

#### How long do demo links last?

Demo links generated on the 'Demo' environment last for 30 days. 'Prod' links are permanent.

#### Can I delete an uploaded file?

Yes, navigate to **Upload Demo**, find the file in the list, and click the red **REMOVE** button.

#### Why is my preview blank?

Ensure you have selected a valid **Template** and **Ad Format**. If the combination is incompatible, the preview may not render.
