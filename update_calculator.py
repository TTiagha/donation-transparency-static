
with open('/mnt/c/shock/static-pages/assets/js/platform-calculator.js', 'r') as f:
    content = f.read()

new_content = """document.addEventListener('DOMContentLoaded', () => {
    const monthlyDonationsEl = document.getElementById('monthly_donations');
    const averageDonationEl = document.getElementById('average_donation');
    const platformSelectEl = document.getElementById('platform_select');
    const resultsEl = document.getElementById('calculator-results');

    const platformFees = {
        donation_transparency: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30 },
        givebutter: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30, tip_based: true },
        donorbox: { platform: 0.0175, processing_percent: 0.029, processing_fixed: 0.30 },
        gofundme: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30, tip_based: true },
        classy: { platform: 0.04, processing_percent: 0.029, processing_fixed: 0.30, subscription: 499 }, // Estimate
    };

    function calculateCosts() {
        const monthlyDonations = parseFloat(monthlyDonationsEl.value) || 0;
        const averageDonation = parseFloat(averageDonationEl.value) || 1;

        if (monthlyDonations <= 0 || averageDonation <= 0) {
            resultsEl.innerHTML = '<p class="text-gray-500">Please enter positive values for donations.</p>';
            return;
        }

        const numberOfDonations = monthlyDonations / averageDonation;
        const fees = platformFees[platformSelectEl.value];

        let platformFeeCost = fees.platform * monthlyDonations;
        if (fees.subscription) {
            platformFeeCost += fees.subscription;
        }

        const processingFeeCost = (monthlyDonations * fees.processing_percent) + (numberOfDonations * fees.processing_fixed);
        const totalCosts = platformFeeCost + processingFeeCost;
        const amountReachingCause = monthlyDonations - totalCosts;

        const dtFees = platformFees['donation_transparency'];
        const dtProcessingFeeCost = (monthlyDonations * dtFees.processing_percent) + (numberOfDonations * dtFees.processing_fixed);
        const dtTotalCosts = dtProcessingFeeCost;
        const savings = totalCosts - dtTotalCosts;

        resultsEl.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Platform Fees</p>
                    <p class="text-2xl font-bold" id="platform-fee-result"></p>
                </div>
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Processing Fees</p>
                    <p class="text-2xl font-bold" id="processing-fee-result"></p>
                </div>
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Total Costs</p>
                    <p class="text-2xl font-bold" id="total-costs-result"></p>
                </div>
                <div class="p-4 bg-emerald-100 rounded-lg col-span-2 md:col-span-3">
                    <p class="text-sm text-emerald-800">Amount Reaching Your Cause</p>
                    <p class="text-3xl font-bold text-emerald-600" id="amount-reaching-cause-result"></p>
                </div>
                ${savings > 0 ? `
                <div class="p-4 bg-cyan-100 rounded-lg col-span-2 md:col-span-3">
                    <p class="text-sm text-cyan-800">Savings with Donation Transparency</p>
                    <p class="text-3xl font-bold text-cyan-600" id="savings-result"></p>
                </div>` : ''}
            </div>
        `;

        new CountUp('platform-fee-result', platformFeeCost, { decimalPlaces: 2, prefix: '$' }).start();
        new CountUp('processing-fee-result', processingFeeCost, { decimalPlaces: 2, prefix: '$' }).start();
        new CountUp('total-costs-result', totalCosts, { decimalPlaces: 2, prefix: '$' }).start();
        new CountUp('amount-reaching-cause-result', amountReachingCause, { decimalPlaces: 2, prefix: '$' }).start();
        if (savings > 0) {
            new CountUp('savings-result', savings, { decimalPlaces: 2, prefix: '$' }).start();
        }
    }

    [monthlyDonationsEl, averageDonationEl, platformSelectEl].forEach(el => {
        el.addEventListener('input', calculateCosts);
    });

    // Initial calculation
    monthlyDonationsEl.value = 5000;
    averageDonationEl.value = 50;
    calculateCosts();
});"""

with open('/mnt/c/shock/static-pages/assets/js/platform-calculator.js', 'w') as f:
    f.write(new_content)

print("Successfully updated platform-calculator.js")
