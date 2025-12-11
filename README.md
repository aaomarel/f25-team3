# f25-team3
CSC 340 semester project by Ahmed and Keith

Ahmed Omar Eltai
Keith Lonon

## Description 
> The product will offer a service to people wanting to find pick up games for either soccer or basketball. We were motivated by our shared passion of recreational sports and the understanding of how hard it can be to get people together to play, especially if you don't know many people. This app aims to remove that obstacle.

## App Functions
1. Customer (the user with the customer role):
    1. Create/modify customer profile - user opens app and hits register and fills in required slots name and email
    2. View available services - once you are register a screen will pop up with two sports soccer/basketball and when you click on the sport a location and time slots will pop up with a option to start or join a game if you hit start a game you get a display screen that shows you two locations where you can select what time you want to play and how many players they want on each team. now if you click on join you be able to pick bewteen locations and you will be able to see how many players are in the game and where the player cap is the user would also be able to select what team they would want to join
    3. Subscribe to available services - so the user would be able to subscribe to play on the competitive basketball court and with this Subscription we would have a leaderbroad that would ranked the players based on how they play


2. Provider:
    1. Create a user profile - All users must create a profile, and all profiles have the ability to either join or create a game instance.
    2. Create game instances - The provider will have the ability to create game instances if no games that have already been created.
    3. Designate play locations and time periods - The provider will be responsible for choosing locations to play and what times. The option to create a game instance will appear for anyone if they find an open slot, and the time/location slots will be pre-determined. 

## Prerequisites

Before running the project, ensure you have the following installed:

- **Java 17** or higher (JDK)
- **Maven** 3.6 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- **PostgreSQL** 12 or higher

## Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database for the project:
   ```sql
   CREATE DATABASE matchmaker;
   ```
3. Update the database configuration in `backend-api/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/matchmaker
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Running the Project

### Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend-api
   ```

2. Install dependencies and build the project:
   ```bash
   ./mvnw clean install
   ```
   Or on Windows:
   ```bash
   mvnw.cmd clean install
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

   The backend API will start on **http://localhost:8080**

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend application will start on **http://localhost:5173**

## Running Both Servers Simultaneously

To run the entire application, you'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend-api
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser and navigate to **http://localhost:5173**

## Project Structure

```
f25-team3/
├── backend-api/          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java source files
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml          # Maven configuration
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
└── doc/                 # Documentation
```

## Default Ports

- **Backend API:** http://localhost:8080
- **Frontend:** http://localhost:5173
- **Database:** localhost:5432

## Troubleshooting

### Backend Issues

- **Port 8080 already in use:** Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
  
- **Database connection error:** Verify PostgreSQL is running and credentials are correct

### Frontend Issues

- **Port 5173 already in use:** Vite will automatically prompt to use an alternative port
  
- **API connection error:** Ensure the backend is running on port 8080

## Testing

Run backend tests:
```bash
cd backend-api
./mvnw test
```

## Building for Production

### Backend
```bash
cd backend-api
./mvnw clean package
java -jar target/f25-team3-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.
