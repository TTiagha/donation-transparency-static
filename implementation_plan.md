# Implementation Plan: Unifying Static & WordPress Sites

**Objective:** To create a seamless user experience by rebuilding the Elementor-based WordPress onboarding flow to visually match the static Amplify site. This involves replacing Elementor with the native WordPress Block Editor (Gutenberg) and styling with a shared Tailwind CSS and Alpine.js configuration.

---

### **Part 1: Staging Environment Setup via AWS Snapshot**

*   **Goal:** Create a safe, isolated, and identical copy of the live WordPress site on a new EC2 instance, accessible via a subdomain.
*   **Assumptions:**
    *   The live site is hosted on an EC2 instance.
<<<<<<< HEAD
    *   Access to the AWS Management Console is available to create snapshots and launch new instances.
=======
    *   Access to the AWS Management Conso1le is available to create snapshots and launch new instances.
>>>>>>> f799a233ae1023e5a288adf6e6e3705d89fe4026
    *   DNS management access is available to create a new subdomain.

*   **Steps:**
    1.  **Create EC2 Snapshot:**
        *   In the AWS EC2 console, select the live server instance.
        *   Create a snapshot of the instance's root EBS volume. This captures the entire server state (OS, files, database, configurations).
    2.  **Launch New Staging Instance:**
        *   Create a new EC2 instance from the snapshot you just created. This can be a smaller, cost-effective instance type (e.g., `t2.micro` or `t3.micro`) if traffic will be low.
        *   Ensure the new instance is assigned a security group that allows HTTP (port 80) and HTTPS (port 443) traffic.
    3.  **Assign Elastic IP & Configure DNS:**
        *   Allocate a new Elastic IP address and associate it with the newly launched staging instance.
        *   In your DNS provider, create an `A` record for `staging.yourdomain.com` pointing to this new Elastic IP address.
    4.  **Update Staging Configuration:**
        *   SSH into the new staging server.
        *   The WordPress files and database will be an exact clone. The only required change is to update the site's URL to prevent redirects to the live domain.
        *   Use the WP-CLI tool (if installed) for a safe search-and-replace: `wp search-replace 'https://yourdomain.com' 'https://staging.yourdomain.com' --skip-columns=guid`
        *   If WP-CLI is not available, update the `siteurl` and `home` options directly in the database via phpMyAdmin or SQL command:
            ```sql
            UPDATE wp_options SET option_value = 'https://staging.yourdomain.com' WHERE option_name = 'siteurl';
            UPDATE wp_options SET option_value = 'https://staging.yourdomain.com' WHERE option_name = 'home';
            ```
    5.  **Install SSL Certificate:**
        *   Issue and install a free Let's Encrypt SSL certificate for `staging.yourdomain.com` using Certbot.

---

### **Part 2: Child Theme, Tailwind CSS, & Alpine.js Integration**

*   **Goal:** Create a new block-based child theme and integrate Tailwind CSS for styling and Alpine.js for interactivity.
*   **Directory:** All work will be done in `/var/www/html/wp-content/themes/` on the **staging server**.

*   **Steps:**
    1.  **Create Child Theme:**
        *   Create a new directory: `dt-onboarding-theme`.
        *   Inside, create `style.css` with the required theme headers, referencing a parent theme like "Twenty Twenty-Four".
        *   Create `functions.php`.
    2.  **Set up Tailwind CSS:**
        *   SSH into the staging server and navigate to the new theme directory.
        *   Initialize a `package.json` file: `npm init -y`.
        *   Install dependencies: `npm install -D tailwindcss postcss autoprefixer`.
        *   Create `tailwind.config.js` and `postcss.config.js` using `npx tailwindcss init -p`.
    3.  **Configure Tailwind:**
        *   **Context:** The `tailwind.config.js` file must be populated with the design tokens from the static site's `light_mode.html`. This includes the custom color palette (`lm-white`, `lm-accent`, etc.) and the `Manrope` font family.
        *   Update the `content` array in `tailwind.config.js` to scan all theme files for classes: `./**/*.php`, `./**/*.html`, `./assets/js/**/*.js`.
    4.  **Create Build Process:**
        *   Create a source CSS file: `assets/css/input.css` and import the three main Tailwind layers.
        *   Add a `build` script to `package.json`: `"build": "tailwindcss -i ./assets/css/input.css -o ./build/style.css --minify"`.
    5.  **Enqueue Styles & Scripts:**
        *   In `functions.php`, write a function hooked to `wp_enqueue_scripts`.
        *   Enqueue the compiled stylesheet: `get_stylesheet_directory_uri() . '/build/style.css'`.
        *   Enqueue the `Manrope` Google Font.
        *   Enqueue Alpine.js from a CDN: `wp_enqueue_script('alpinejs', 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js', array(), null, true);`

---

### **Part 3: Rebuilding the Full Application Interface**

*   **Goal:** Systematically replace all user-facing Elementor-driven pages with the new, consistently styled native block theme. This includes all authenticated and public-facing application views.
*   **Scope of Work:** The following application sections will be rebuilt page by page:
    1.  **Onboarding Flow:** All steps a new user takes to sign up and get started.
    2.  **Receiver Dashboard:** The main dashboard for users who receive donations. This includes all sub-sections (e.g., viewing donations, managing campaigns, settings).
    3.  **Receiver Donation Page:** The public-facing page where others can donate to a receiver.
    4.  **Giver Dashboard:** The main dashboard for users who have donated. This includes their donation history, recurring payments, and account settings.
*   **Process:**
    *   **Component-First Approach:** Before tackling full pages, we will identify and build common, reusable UI components (e.g., stat cards for dashboards, transaction history tables, profile setting forms) as WordPress Block Patterns. This will dramatically speed up the page-building process and ensure consistency.
    *   **Page by Page Reconstruction:** For each page within the scope, the process remains the same:
        *   Switch the page to use the native Block Editor on the staging site.
        *   Reconstruct the layout using a combination of native blocks and the custom block patterns we created.
        *   Apply Tailwind CSS classes for precise styling.
        *   Use Alpine.js for any required front-end interactivity (e.g., filtering a donation list, tabbed content).
    *   **Critical Functionality Testing:** As each section is rebuilt, we must rigorously test its core functionality (e.g., making a test donation, updating a profile, viewing a transaction) in the staging environment with sandbox credentials.

---

### **Part 4: Pre-Deployment Synchronization**

*   **Goal:** Sync recent data changes from the live site to the staging site before go-live.
*   **Steps:**
    1.  **Schedule Content Freeze:** Announce a 1-2 hour window where no new content is added to the live site.
    2.  **Sync Database:** Use a plugin like "WP Migrate DB" or a similar tool to **pull** the live database to the staging environment. This syncs all new posts, users, and plugin data added since the staging site was created.
    3.  **Final QA:** Perform a final walkthrough of the staging site to ensure all new live content and functionality works correctly with the new theme.

---

### **Part 5: Go-Live Deployment**

*   **Goal:** Deploy the new theme and rebuilt pages to the live site.
*   **Steps:**
    1.  **Backup Live Site:** Before any changes, take a final AWS snapshot of the live server.
    2.  **Deploy Theme:**
        *   Upload the completed child theme (`dt-onboarding-theme`) from the staging server to the live site's `/wp-content/themes/` directory via SFTP/SCP.
    3.  **Deploy Rebuilt Pages:**
        *   The safest method is to manually replicate the block structure of the rebuilt pages from staging onto the corresponding pages on the live site. A database push for specific pages is risky and complex. Rebuilding them on live using the now-active theme is fast and safe.
    4.  **Activate & Decommission:**
        *   In the live site's admin dashboard, activate the new child theme (`dt-onboarding-theme`).
        *   Verify the site looks and works as expected.
        *   Deactivate and uninstall the Elementor and Elementor Pro plugins.
    5.  **Final Verification:**
        *   Thoroughly test the live site, especially the onboarding flow with **live** Stripe/Plaid credentials.
