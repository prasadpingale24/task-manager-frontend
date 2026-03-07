# Team Tasks Manager - Frontend

A sleek, responsive, and high-performance task management interface built with React and Vite. Designed for professional teams who need a clean and efficient workspace.

## 🚀 Key Features

- **Blazing Fast Performance**: Built with Vite and optimized for instant loading.
- **Modern UI**: Styled with Tailwind CSS and Shadcn UI for a premium, clean aesthetic.
- **Persistent Authentication**: Seamless login/signup flow with secure JWT management.
- **Real-time Synchronization**: Powered by React Query for automatic server state updates.
- **Feature-Driven Design**: Highly modular codebase for long-term maintainability.
- **CI/CD Integration**: Fully automated pipeline via Jenkins Shared Library.

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/) (Vite)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Networking**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏠 System Architecture
Detailed technical documentation: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 📁 Project Structure

```text
├── src/
│   ├── api/          # Axios client & global interceptors
│   ├── components/   # Shared UI components (Shadcn)
│   ├── features/     # Feature-based modules (auth, projects, tasks)
│   ├── pages/        # Application routes & layout components
│   ├── store/        # Zustand state stores with persistence
│   ├── types/        # TypeScript interfaces & API response types
│   ├── App.tsx       # Main routing & provider configuration
│   └── main.tsx      # Application entry point
├── public/           # Static assets
├── Dockerfile        # Production-grade multi-stage build
├── docker-compose.yml# Service orchestration
└── Jenkinsfile       # Automated CI/CD pipeline
```

## 🏃 Running Locally

### Prerequisites
- **Node.js**: 18.x or 20.x
- **Docker & Docker Compose**: To run the containerized stack.

### Installation
1.  **Clone the Repo**
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    ```bash
    cp .env.example .env
    ```
    Set your `VITE_API_BASE_URL` to point to your backend (default: `http://localhost:8000/api/v1`).
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🐋 Docker Execution
For the most consistent experience, use Docker Compose to run the frontend.

```bash
# Build and start the frontend in the background
docker compose up --build -d
```

*Note: If you need to test the production image in total isolation, you can use:*
`docker build -t frontend-prod . && docker run -p 3000:3000 frontend-prod`

## 🔄 Automated Deployment (CI/CD)

The project includes a production-grade `Jenkinsfile` that automates the entire lifecycle:
1. **Prepare Environment**: Generates a `.env` file from Jenkins credentials and validates for missing keys.
2. **Build**: Uses multi-stage builds to produce a lightweight static site container.
3. **Push**: Pushes production-ready images to Docker Hub.
4. **Deploy**: Automatically deploys the new image to the production server.
5. **Health Check**: Verifies the application is responding on port 3000 after deployment.

---

*Documentation last updated: March 2026*
