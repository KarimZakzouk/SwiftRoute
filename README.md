# 🚍 SwiftRoute: Your Smart Transportation Solution

SwiftRoute is a full-stack web application designed to simplify transportation challenges for users, drivers, and station managers. Whether you're finding the best route, booking a trip, or checking trip availability at stations, SwiftRoute has you covered! (●’◡’●)

## 🌟 What We Offer

SwiftRoute makes transportation seamless for users by providing:

- **Find Available Trips**: Check trip availability at stations before heading there.
- **Book Trips**: Reserve trips in advance to save time and avoid hassle.
- **Request Private Trips**: Travel between different governorates by requesting a private trip directly from drivers.

### Features for Managers and Admins
- **Admins**:
  - Approve stations to operate on the platform.
  - Ensure smooth operation across the website.
- **Managers**:
  - Hire or fire drivers.
  - Update driver salaries.
  - Set and manage available trips.

## 💡 Why SwiftRoute?

SwiftRoute bridges the gap between users, drivers, and station managers, offering real-time updates and seamless communication to ensure the best travel experience for everyone.

## 👨‍💻 My Role
I, Karim Farid Abdelhamid, contributed to this project as part of a team effort during my studies at Cairo University. In this repository, I have recreated my individual contributions and set up a Dockerized version to showcase my work:

- Designed and implemented the location-based search functionality for finding trips using React.js and REST APIs.
- Developed the Node.js backend with Express.js to manage trip data and integrate with the PostgreSQL database.
- Configured Docker Compose to streamline deployment of the frontend, backend, and database services.

## 🤝 Developed By
This project was a collaborative effort by the following team members:
- Abdullah Elnoory
- Karim Farid (me)
- Mazen Hatem
- Yousef Adel
- Chad G. Patton

## 🛠 Tech Stack
- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose

## 📋 Prerequisites
To run SwiftRoute, ensure you have the following installed:
- **Docker** and **Docker Compose**.
- Git to clone the repository.

## 🚀 How to Run
Follow these steps to set up and run SwiftRoute using Docker Compose:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KarimZakzouk/SwiftRoute.git
   ```

2. **Navigate to the Directory**:
   ```bash
   cd SwiftRoute
   ```

3. **Start the Application**:
   - Run the following command to build and start the services:
     ```bash
     docker compose up --build
     ```
   - This will start three containers: `frontend`, `backend`, and `db` (PostgreSQL).

4. **Access the Application**:
   - Frontend: Open your browser and go to `http://localhost:3000`.
   - Backend API (for testing): `http://localhost:6969`.
   - PostgreSQL: Running on `localhost:5432` (credentials defined in `docker-compose.yml`).

5. **Stop the Application**

   - If running docker compose up in the terminal, press Ctrl + C to stop the containers gracefully.
   - Alternatively, from the project directory (~/SwiftRoute), run:
     ```bash
     docker compose down
     ```
   - This stops and removes the frontend, backend, and db containers defined in docker-compose.yml.

6. **Remove Stopped Containers (Optional)**

   - To clean up all stopped containers:
     ```bash
    docker container prune
     ```
   - Confirm with y when prompted.

## 🐞 Troubleshooting
- If the frontend fails with `react-scripts: not found`, ensure `frontend/package.json` includes `"react-scripts": "^5.0.1"` and the `frontend/Dockerfile` has `RUN npm install`.
- If the backend fails with `Cannot find module 'express'`, verify `backend/package.json` includes `"express": "^4.18.2"` and the `backend/Dockerfile` has `RUN npm install`.
- Rebuild with `docker compose down` followed by `docker compose up --build` if issues persist.

## 📝 Additional Notes
- **Team Context**: This project was originally a collaborative effort with my teammates, who hosted the initial version. This repository contains my personal implementation with a Dockerized setup.
- **Feedback**: For questions, suggestions, or issues, please open an issue on this repository or contact me at [karimzakzouk@outlook.com].
---

SwiftRoute: Solving transportation issues, one trip at a time! 🌍
```

---
