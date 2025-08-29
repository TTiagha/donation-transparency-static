document.addEventListener('DOMContentLoaded', () => {
    const monthlyDonationsEl = document.getElementById('monthly_donations');
    const averageDonationEl = document.getElementById('average_donation');
    const platformSelectEl = document.getElementById('platform_select');
    const donorCoversFeesEl = document.getElementById('donor_covers_fees');
    const resultsEl = document.getElementById('calculator-results');

    const platformFees = {
        donation_transparency: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30, donor_option: true },
        givebutter: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30, donor_option: true },
        donorbox: { platform: 0.0175, processing_percent: 0.029, processing_fixed: 0.30, donor_option: true },
        gofundme: { platform: 0, processing_percent: 0.029, processing_fixed: 0.30, donor_option: true },
        classy: { platform: 0.04, processing_percent: 0.029, processing_fixed: 0.30, subscription: 499, donor_option: false }, // Estimate
    };

    function calculateCosts() {
        const monthlyDonations = parseFloat(monthlyDonationsEl.value) || 0;
        const averageDonation = parseFloat(averageDonationEl.value) || 1;
        const donorCoversFeesChecked = donorCoversFeesEl && donorCoversFeesEl.checked;

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

        // Only apply processing fees if donor doesn't cover them or platform doesn't offer option
        let processingFeeCost = 0;
        if (!donorCoversFeesChecked || !fees.donor_option) {
            processingFeeCost = (monthlyDonations * fees.processing_percent) + (numberOfDonations * fees.processing_fixed);
        }
        
        const totalCosts = platformFeeCost + processingFeeCost;
        const amountReachingCause = monthlyDonations - totalCosts;

        const donorCoverageNote = donorCoversFeesChecked && fees.donor_option ? 
            '<p class="text-xs text-green-600 mt-1">✓ Processing fees covered by donors</p>' : '';
            
        resultsEl.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Platform Fees</p>
                    <p class="text-2xl font-bold" id="platform-fee-result"></p>
                </div>
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Processing Fees</p>
                    <p class="text-2xl font-bold" id="processing-fee-result"></p>
                    ${donorCoverageNote}
                </div>
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">Total Costs</p>
                    <p class="text-2xl font-bold" id="total-costs-result"></p>
                </div>
                <div class="p-4 bg-emerald-100 rounded-lg col-span-2 md:col-span-3">
                    <p class="text-sm text-emerald-800">Amount Reaching Your Cause</p>
                    <p class="text-3xl font-bold text-emerald-600" id="amount-reaching-cause-result"></p>
                </div>
            </div>
        `;

        // Check if CountUp is available, otherwise fallback to direct display
        if (typeof CountUp !== 'undefined') {
            new CountUp('platform-fee-result', platformFeeCost, { decimalPlaces: 2, prefix: '$' }).start();
            new CountUp('processing-fee-result', processingFeeCost, { decimalPlaces: 2, prefix: '$' }).start();
            new CountUp('total-costs-result', totalCosts, { decimalPlaces: 2, prefix: '$' }).start();
            new CountUp('amount-reaching-cause-result', amountReachingCause, { decimalPlaces: 2, prefix: '$' }).start();
        } else {
            // Fallback if CountUp not loaded
            document.getElementById('platform-fee-result').textContent = '$' + platformFeeCost.toFixed(2);
            document.getElementById('processing-fee-result').textContent = '$' + processingFeeCost.toFixed(2);
            document.getElementById('total-costs-result').textContent = '$' + totalCosts.toFixed(2);
            document.getElementById('amount-reaching-cause-result').textContent = '$' + amountReachingCause.toFixed(2);
        }
    }

    [monthlyDonationsEl, averageDonationEl, platformSelectEl].forEach(el => {
        el.addEventListener('input', calculateCosts);
    });
    
    if (donorCoversFeesEl) {
        donorCoversFeesEl.addEventListener('change', calculateCosts);
    }

    // Initial calculation
    monthlyDonationsEl.value = 5000;
    averageDonationEl.value = 50;
    calculateCosts();
});