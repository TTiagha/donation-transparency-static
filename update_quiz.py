
with open('/mnt/c/shock/static-pages/assets/js/trust-quiz.js', 'r') as f:
    content = f.read()

new_content = """document.addEventListener('DOMContentLoaded', () => {
    const quizQuestionsEl = document.getElementById('quiz-questions');
    const quizResultsEl = document.getElementById('quiz-results');

    const questions = [
        {
            question: "How important is seeing exactly where your donation goes?",
            type: "scale",
            options: ["Not important", "Slightly important", "Moderately important", "Very important", "Essential"],
        },
        {
            question: "Have you ever hesitated to donate due to transparency concerns?",
            type: "choice",
            options: ["Yes", "No"],
        },
        {
            question: "Would real-time spending reports increase your donation amount?",
            type: "choice",
            options: ["Yes", "No"],
        },
        {
            question: "How often do you check on the impact of your past donations?",
            type: "choice",
            options: ["Never", "Rarely", "Sometimes", "Often"],
        },
        {
            question: "What matters most in a fundraising platform?",
            type: "choice",
            options: ["Low Fees", "Ease of Use", "Brand Recognition", "Transparency Features"],
        },
    ];

    let currentQuestionIndex = 0;
    let userAnswers = [];

    function renderQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        const question = questions[currentQuestionIndex];
        let optionsHtml = '';

        if (question.type === 'scale') {
            optionsHtml = question.options.map((opt, i) => `
                <button class="quiz-option scale" data-value="${i + 1}">${opt}</button>
            `).join('');
        } else {
            optionsHtml = question.options.map(opt => `
                <button class="quiz-option choice" data-value="${opt}">${opt}</button>
            `).join('');
        }

        quizQuestionsEl.innerHTML = `
            <div class="text-center">
                <div class="quiz-progress-bar"><div class="quiz-progress-bar-fill" style="width: ${((currentQuestionIndex) / questions.length) * 100}%"></div></div>
                <p class="text-lg font-semibold mb-4">${question.question}</p>
                <div class="flex flex-wrap justify-center gap-4">${optionsHtml}</div>
                <p class="text-sm text-gray-500 mt-4">Question ${currentQuestionIndex + 1} of ${questions.length}</p>
            </div>
        `;
    }

    function handleAnswer(e) {
        if (!e.target.classList.contains('quiz-option')) return;

        userAnswers.push({ 
            question: questions[currentQuestionIndex].question,
            answer: e.target.dataset.value 
        });
        currentQuestionIndex++;
        renderQuestion();
    }

    function calculateScore() {
        let score = 0;
        userAnswers.forEach(answer => {
            switch(answer.question) {
                case questions[0].question: score += parseInt(answer.answer) * 4; break; // 20 max
                case questions[1].question: if(answer.answer === 'Yes') score += 20; break;
                case questions[2].question: if(answer.answer === 'Yes') score += 20; break;
                case questions[3].question: 
                    const freq = ['Never', 'Rarely', 'Sometimes', 'Often'];
                    score += freq.indexOf(answer.answer) * 5; break; // 15 max
                case questions[4].question: if(answer.answer === 'Transparency Features') score += 25; break;
            }
        });
        return Math.min(100, score);
    }

    function showResults() {
        const score = calculateScore();
        let recommendation = '';

        if (score > 80) {
            recommendation = 'You are a transparency-focused donor. Platforms with real-time reporting like <strong>Donation Transparency</strong> are a perfect fit for you.';
        } else if (score > 50) {
            recommendation = 'You value transparency and impact. You would benefit from a platform that provides clear financial breakdowns and regular updates.';
        } else {
            recommendation = 'While fees and ease of use are important, consider how transparency can build more trust and lead to greater impact in your giving.';
        }

        quizQuestionsEl.classList.add('hidden');
        quizResultsEl.classList.remove('hidden');
        quizResultsEl.innerHTML = `
            <div class="text-center">
                <p class="text-xl font-bold">Your Trust Score:</p>
                <p class="text-6xl font-extrabold text-cyan-500 my-4">${score}/100</p>
                <p class="text-lg">${recommendation}</p>
                <button id="retake-quiz" class="mt-6 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all transform hover:scale-105">Retake Quiz</button>
            </div>
        `;
    }

    function retakeQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizResultsEl.classList.add('hidden');
        quizQuestionsEl.classList.remove('hidden');
        renderQuestion();
    }

    quizQuestionsEl.addEventListener('click', handleAnswer);
    quizResultsEl.addEventListener('click', e => {
        if (e.target.id === 'retake-quiz') {
            retakeQuiz();
        }
    });

    renderQuestion();
});"""

with open('/mnt/c/shock/static-pages/assets/js/trust-quiz.js', 'w') as f:
    f.write(new_content)

print("Successfully updated trust-quiz.js")
