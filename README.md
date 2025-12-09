# Todo List Application - CI/CD Pipeline

## Team Members

| NOM | Prénom |
|-----|--------|
| BLAIS | [Your Name] |

## Project Overview

This is a comprehensive Todo List application with a complete CI/CD pipeline setup. The application consists of:

- **Backend**: Node.js + Express API with TypeScript
- **Frontend**: React application with Vite
- **CI/CD**: GitHub Actions with automated testing, security scanning, and deployment

## Architecture & Technical Choices

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Error Tracking**: Sentry for real-time error monitoring
- **Database**: JSON file-based storage (can be upgraded to a real DB)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### CI/CD Pipeline
- **Platform**: GitHub Actions
- **Testing**: Node.js built-in test runner
- **Docker**: Multi-stage build for optimized production image
- **Security**: npm audit + Trivy container scanning
- **Deployment**: Vercel (frontend) + Render (backend)

## Local Installation & Testing

### Prerequisites
- Node.js 20+
- npm 8+
- Docker (optional, for local Docker builds)

### Setup Backend

\\\ash
cd packages/server
npm install
npm run build
npm run start
\\\

**For development with hot reload:**
\\\ash
npm run dev
\\\

**Running tests:**
\\\ash
npm test
\\\

**Running tests with coverage:**
\\\ash
npm run test:coverage
\\\

### Setup Frontend

\\\ash
cd packages/client
npm install
npm run dev
\\\

**For production build:**
\\\ash
npm run build
\\\

## API Endpoints

### GET /api/todos
Retrieve all todos.

**Response:**
\\\json
[
  {
    "id": "1234567890",
    "text": "Learn CI/CD",
    "completed": false,
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
\\\

### POST /api/todos
Create a new todo.

**Request Body:**
\\\json
{
  "text": "Buy groceries"
}
\\\

### PATCH /api/todos/:id
Toggle a todo's completion status.

### DELETE /api/todos/:id
Delete a todo.

### GET /fail (Testing Route)
Intentionally throws an error to test Sentry integration.

## Deployed URLs

- **Frontend**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.onrender.com

*Note: Update these URLs after deployment*

## CI/CD Pipeline Configuration

### Pipeline Stages

#### 1. **Quality Assurance**
- **lint-commits**: Validates that commit messages follow Conventional Commits specification
- **test-unit**: Runs backend unit tests using Node.js test runner
  - Tests include: \ddTodo\, \	oggleTodo\, \deleteTodo\, \getAllTodos\
  - Generates coverage reports
- **coverage**: Checks that test coverage meets minimum threshold (60%)

#### 2. **Security**
- **security-scan-npm**: Runs \
pm audit --audit-level=high\ on both frontend and backend
  - Fails if high-risk or critical vulnerabilities are found
- **security-scan-docker**: Uses Trivy to scan Docker image after build
  - Only runs on Pull Requests
  - Fails if critical vulnerabilities are detected

#### 3. **Packaging**
- **build-docker**: Builds Docker image using multi-stage Dockerfile
  - On PRs: Builds image without pushing (for security scanning)
  - On tags (v*.*.* ): Builds and pushes to Docker Hub with version tag

#### 4. **Deployment** (Triggered on version tags only)
- **deploy-backend**: Deploys versioned Docker image to Render
- **deploy-frontend**: Builds and deploys to Vercel
- **smoke-test**: Validates that both frontend and backend are responding correctly

#### 5. **Notifications**
- **notify**: Sends success/failure messages to Discord webhook
  - Success:  message with green color
  - Failure:  message with red color

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

\\\
DOCKER_USERNAME          # Docker Hub username
DOCKERHUB_TOKEN          # Docker Hub personal access token
RENDER_DEPLOY_HOOK       # Render deployment webhook URL
VERCEL_TOKEN             # Vercel personal access token
VERCEL_ORG_ID            # Vercel organization ID
VERCEL_PROJECT_ID        # Vercel project ID
BACKEND_URL              # Deployed backend URL for smoke tests
FRONTEND_URL             # Deployed frontend URL for smoke tests
DISCORD_WEBHOOK          # Discord webhook URL for notifications
SENTRY_DSN               # Sentry Data Source Name for error tracking
\\\

## Conventional Commits Format

All commits must follow the Conventional Commits specification:

\\\
<type>(<scope>): <subject>

<body>

<footer>
\\\

**Types:**
- \eat\: A new feature
- \ix\: A bug fix
- \docs\: Documentation changes
- \style\: Code style changes (formatting, missing semicolons, etc.)
- \efactor\: Code refactoring
- \	est\: Adding or updating tests
- \chore\: Build process, dependencies, etc.

**Examples:**
\\\
feat(todos): add filter by completion status
fix(api): handle empty todo text properly
test(todos): add unit test for toggleTodo function
docs: update API documentation
\\\

## Sentry Integration

### Error Tracking

The backend is integrated with Sentry for real-time error monitoring.

**Configuration:**
- Environment: Set via \NODE_ENV\ environment variable
- Traces Sample Rate: 100% (development)
- Profiles Sample Rate: 100% (for profiling enabled bonus)

### Test Error Route

To test Sentry integration:

\\\ash
curl http://localhost:3001/fail
\\\

This will trigger an intentional error that will be captured in your Sentry dashboard.

## Rollback Strategy

### Scenario
If version \1.0.2\ is deployed but has critical bugs, and you need to rollback to \1.0.1\:

### Strategy

1. **Docker Image Rollback**
   \\\ash
   # Render will pull the previous version from Docker Hub
   # Since all versions are tagged (v1.0.1, v1.0.2, latest)
   # You can deploy v1.0.1 by:
   
   # Option A: Update Render deployment to use specific tag
   docker pull docker_username/todo-api:v1.0.1
   # Then redeploy through Render dashboard
   
   # Option B: Create a tag for rollback
   git tag v1.0.2-rollback v1.0.1
   git push origin v1.0.2-rollback
   # This triggers the CD pipeline with the old code
   \\\

2. **Git-Based Rollback** (Recommended)
   \\\ash
   # Revert the broken commit
   git revert v1.0.2
   
   # Create a new patch version
   git tag v1.0.3
   git push origin v1.0.3
   
   # This triggers a full deployment with the fixed code
   \\\

3. **Immediate Rollback via Docker Tags**
   \\\ash
   # All pushed images retain their version tags:
   # - v1.0.0
   # - v1.0.1
   # - v1.0.2
   # - latest (points to v1.0.2)
   
   # To rollback: Update Render to deploy from 'v1.0.1' tag instead of 'latest'
   \\\

### Why This Works
- **Immutable versioning**: Each Git tag creates a corresponding Docker tag
- **Quick recovery**: Old images are still available on Docker Hub
- **Traceability**: Full git history shows what was deployed when
- **Automation**: Re-tagging v1.0.1 triggers the full pipeline automatically

## Testing the Pipeline

### Manual Testing Commands

\\\ash
# Test conventional commits
git log --oneline -5  # Should show proper commit messages

# Run unit tests locally
cd packages/server && npm test

# Run security audit locally
cd packages/server && npm audit --audit-level=high
cd packages/client && npm audit --audit-level=high

# Build Docker image locally
docker build -t todo-api:test .

# Scan with Trivy
docker run aquasec/trivy image --severity HIGH,CRITICAL todo-api:test
\\\

### Testing on GitHub

1. Create a feature branch: \git checkout -b feat/test-feature\
2. Make changes with proper commit messages
3. Push and create a Pull Request
4. Pipeline will automatically run all CI checks
5. To test deployment: Create a version tag \git tag v1.0.0\ and push

## Project Structure

\\\
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions pipeline
├ packages/
    client/                 # React frontend
       src/
       package.json
       ...
    server/                 # Node.js backend
        src/
           index.ts        # Express app with Sentry
           todos.ts        # Business logic
           todos.test.ts   # Unit tests
           storage.ts      # Data persistence
        dist/               # Compiled JavaScript
        package.json
        tsconfig.json
 Dockerfile                  # Multi-stage build
 README.md                   # This file
 .gitignore
\\\

## Troubleshooting

### Docker Build Fails
- Check Docker daemon is running
- Verify Docker Hub credentials: \docker login\
- Check available disk space

### Tests Fail
\\\ash
# Clear node_modules and reinstall
rm -rf packages/server/node_modules
npm install
npm test
\\\

### Deployment Issues
- Verify Render deploy hook is correct
- Check Vercel project ID and token
- Ensure environment variables are set in deployment platform

### Sentry Not Capturing Errors
- Verify \SENTRY_DSN\ is set in environment variables
- Check Sentry project is active
- Test with: \curl http://localhost:3001/fail\

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Sentry Documentation](https://docs.sentry.io/)
- [Trivy Security Scanner](https://aquasecurity.github.io/trivy/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## License

MIT

---

**Last Updated**: December 2025
**Pipeline Status**: See GitHub Actions for current status
