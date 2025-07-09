# SEO Optimization Action Plan

This document outlines the specific, implementable actions required to resolve the keyword cannibalization issues identified in the `cannibalization-report.md`, based on the revised scope focusing on the `/guides/` content section.

---

### 1. Pages to Consolidate & Merge

The primary consolidation action is to merge thin, competing content into a more comprehensive guide.

-   **Action:** Merge the content from `static-pages/transparency/donor-confidence.html` into `static-pages/guides/building-donor-trust.html`.
-   **Justification:** The `donor-confidence.html` page is a thin (~250 words) article that directly competes with the more in-depth `building-donor-trust.html` guide for the same search intent (`how to build donor trust/confidence`). Merging them will create a single, more authoritative page, strengthening our ranking potential for these keywords.

### 2. Pages to Delete & Redirect

To prevent broken links and pass link equity, pages that are being merged must be properly redirected.

-   **Action:** After its content has been successfully merged, delete `static-pages/transparency/donor-confidence.html`.
-   **Redirect Instruction:** Implement a permanent 301 redirect.
    ```
    Redirect 301 /static-pages/transparency/donor-confidence.html /static-pages/guides/building-donor-trust.html
    ```

### 3. Content Differentiation Strategies

To resolve keyword competition between informational guides and commercial feature pages, we must clarify their purpose for search engines and users.

-   **Guides vs. Product Pages:**
    -   **Objective:** Differentiate the purpose of educational guides from product-focused feature pages.
    -   **Action for `static-pages/features/` pages:** Optimize these pages for commercial-intent keywords.
        -   Example for `transparency-management-dashboard.html`: Target "transparency dashboard software," "nonprofit reporting tool."
        -   Example for `real-time-tracking.html`: Target "real-time donation tracking tool," "live fundraising tracker."
    -   **Action for `static-pages/guides/` pages:** Keep these pages focused on informational keywords.
        -   Example for `transparency-accountability-mastery.html`: Target "how to improve nonprofit transparency," "guide to financial accountability."
        -   Example for `building-donor-trust.html`: Target "how to build donor trust," "guide to donor relationships."
    -   **Internal Linking:** Crucially, update the guides to include strong, contextually relevant internal links pointing to the corresponding feature pages as the "solution" or "tool" that helps implement the guide's advice.

-   **"New Charity" vs. "First-Time Fundraiser" Guides:**
    -   **Objective:** Clarify the distinct intent of the two guides that target beginner fundraisers.
    -   **Action:** Rewrite the page titles and meta descriptions to be more specific.
        -   **For `complete-fundraising-starter.html`:**
            -   **Proposed Title:** `How to Launch Your First Fundraiser: A Step-by-Step Guide`
            -   **Proposed Meta Description:** `Our complete starter guide provides a step-by-step checklist for new charities and first-time fundraisers to launch a successful campaign.`
        -   **For `building-donor-trust.html`:**
            -   **Proposed Title:** `A New Fundraiser's Guide to Building Lasting Donor Trust`
            -   **Proposed Meta Description:** `Learn the core principles of communication and transparency that help new fundraisers build and maintain donor trust from day one.`
    -   **Cross-Promotion:** Each guide should prominently link to the other, creating a clear pathway for users to understand both the tactical "how-to" and the strategic "why."

### 4. Internal Linking Refinement

Ensure content flows logically and passes authority to the most relevant pages.

-   **Action:** Review `building-donor-trust.html` to ensure its primary focus remains on high-level trust-building strategy. Within the content, add a clear internal link to `community-local-fundraising.html` when discussing the application of these principles in a local context.