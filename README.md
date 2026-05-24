# Veritas AI 🛡️

Veritas AI is an advanced, AI-powered content and deepfake detection platform. Built with a premium, modern aesthetic, it leverages the Google Gemini API to analyze text, images, videos, and URLs for authenticity, helping users identify AI-generated content and deepfakes with high precision.

![Veritas AI Preview](https://via.placeholder.com/1200x600?text=Veritas+AI+-+Premium+Content+Analysis) <!-- Replace with actual screenshot -->

## 🌟 Key Features

*   **Multi-Modal Analysis:**
    *   📝 **Text Analysis:** Detects AI writing patterns, vocabulary distribution, and syntactic consistency.
    *   🖼️ **Image Analysis:** Identifies manipulated pixels, GAN artifacts, and AI generation markers.
    *   🎬 **Video Analysis:** Scans for deepfake indicators, temporal inconsistencies, and facial anomalies.
    *   🔗 **URL Analysis:** Evaluates web pages and linked media for AI-generated content.
*   **Powered by Gemini 2.5 Flash:** Utilizes the latest Google Gemini models via direct REST API for fast, accurate, and free-tier-friendly analysis.
*   **Premium UI/UX:** A stunning, responsive, Apple-inspired glass-morphic design with smooth Framer Motion animations.
*   **Secure Authentication:** Firebase integration for secure Email/Password and Google Sign-in.
*   **Dashboard & History:** Tracks past analyses and presents comprehensive metrics visually using Recharts.
*   **Dark/Light Mode:** Full theming support via Tailwind CSS and CSS variables.

## 🚀 Technologies Used

*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Recharts
*   **Backend / AI:** Google Gemini API (REST)
*   **Authentication & Hosting:** Firebase
*   **Routing:** React Router DOM

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/veritas-ai.git
    cd veritas-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🧠 How the AI Works

Veritas AI uses Google's `gemini-2.5-flash` model. 
*   Text inputs are analyzed for linguistic patterns typical of LLMs.
*   Images and videos use Gemini Vision capabilities to detect visual artifacts.
*   If the Gemini API key is missing or quota is exhausted, the platform seamlessly falls back to a simulated heuristic analysis mode, ensuring the UI remains fully functional for demonstration purposes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
