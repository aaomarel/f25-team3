# Match Maker Requirements Testing

## Actors
- Host (Game Creator/Provider)
- Player (Customer)

### Use Cases

#### 1. Host: Create host profile use case:
1. Host H1 logs in for the first time and creates a profile.
2. H1 creates new games G1 and G2 with values for searchable criteria C1, C2, C3 (C1=Soccer, C2=Recreation Center, C3=2025-12-15).  
H1 exits the app.

#### 2. Player: Create player profile:
1. Player P1 logs in for the first time and creates a profile.

#### 3. Player: View and join games:
1. Player P2 logs in for the first time and creates a new profile.
2. P2 views available games G1 and G2.
3. P2 joins G1.

#### 4. Player: View game details
1. P2 logs in and views their joined games.
2. P2 views details of game G1 including sport, location, date, time, and player count. P2 exits.

#### 5. Player: Modify profile & leave game
1. P1 logs in and modifies their profile.
2. P1 views game G1 and the game details.
3. P1 joins G1. 
4. P1 decides to leave G1. P1 exits.

#### 6. Host: Edit game, view player statistics, & modify profile use cases
1. Host H1 logs in and views their created games.
2. H1 edits game G1 to update the player limit.
3. H1 views player statistics (players joined count).
4. H1 modifies their profile. H1 exits.

---

## Test Procedures

### Test Case 1: Host Creates Profile and Games

**Objective:** Verify that a host can create a profile and create multiple games with searchable criteria.

**Preconditions:** 
- Application is running (backend on port 8080, frontend on port 5173)
- No existing user with test credentials

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Navigate to the application home page | Home page displays with navigation options |
| 1.2 | Click "Sign Up" button | Sign up form is displayed |
| 1.3 | Enter name: "Host One", username: "host1", email: "host1@test.com", password: "password123" | Form accepts input |
| 1.4 | Click "Sign Up" button | Account created, redirected to login page with success message |
| 1.5 | Enter login credentials (email: "host1@test.com", password: "password123") | Login successful, redirected to dashboard |
| 1.6 | Click "Create Game" in navigation | Create game form is displayed |
| 1.7 | Select Sport: "Soccer", Location: "Recreation Center", Date: "2025-12-15", Time: "10:00 AM", Player Limit: "10" | Form accepts all input values |
| 1.8 | Click "Create Game" button | Game G1 created, success notification shown |
| 1.9 | Navigate to "Create Game" again | Create game form is displayed |
| 1.10 | Select Sport: "Basketball", Location: "Gym", Date: "2025-12-16", Time: "2:00 PM", Player Limit: "8" | Form accepts all input values |
| 1.11 | Click "Create Game" button | Game G2 created, success notification shown |
| 1.12 | Log out of the application | User logged out, redirected to home page |

**Postconditions:** 
- Host H1 account exists in the system
- Games G1 (Soccer) and G2 (Basketball) exist and are visible to other users

---

### Test Case 2: Player Creates Profile

**Objective:** Verify that a player can create a new profile.

**Preconditions:** 
- Application is running
- No existing user with test credentials

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Navigate to the application home page | Home page displays |
| 2.2 | Click "Sign Up" button | Sign up form is displayed |
| 2.3 | Enter name: "Player One", username: "player1", email: "player1@test.com", password: "password123" | Form accepts input |
| 2.4 | Click "Sign Up" button | Account created, redirected to login page with success message |

**Postconditions:** 
- Player P1 account exists in the system

---

### Test Case 3: Player Views and Joins Games

**Objective:** Verify that a player can view available games and join a game.

**Preconditions:** 
- Application is running
- Games G1 and G2 exist (from Test Case 1)
- No existing user with test credentials for P2

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1 | Navigate to the application home page | Home page displays |
| 3.2 | Click "Sign Up" button | Sign up form is displayed |
| 3.3 | Enter name: "Player Two", username: "player2", email: "player2@test.com", password: "password123" | Form accepts input |
| 3.4 | Click "Sign Up" button | Account created, redirected to login page |
| 3.5 | Log in with credentials (email: "player2@test.com", password: "password123") | Login successful, redirected to dashboard |
| 3.6 | Click "Browse Games" in navigation | Browse games page displays |
| 3.7 | Verify games G1 and G2 are displayed | Both Soccer game (G1) and Basketball game (G2) are visible with details |
| 3.8 | Click "Join" button on game G1 (Soccer) | Success notification: "Successfully joined the match!" |
| 3.9 | Navigate to "My Games" | My Games page displays |
| 3.10 | Click "Games I Joined" tab | Player's joined games list displays with G1 visible |

**Postconditions:** 
- Player P2 account exists in the system
- Player P2 is registered as a participant in game G1

---

### Test Case 4: Player Views Game Details

**Objective:** Verify that a player can view detailed information about their joined games.

**Preconditions:** 
- Application is running
- Player P2 is logged in
- Player P2 has joined game G1

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1 | Navigate to "My Games" | My Games page displays |
| 4.2 | Click "Games I Joined" tab | List of joined games displays including G1 |
| 4.3 | Click "View Details" button on game G1 | Modal/detail view opens showing: Sport (Soccer), Location (Recreation Center), Date (2025-12-15), Time (10:00 AM), Players joined count, Player limit (10) |
| 4.4 | Close the details modal | Modal closes, returns to games list |
| 4.5 | Log out of the application | User logged out, redirected to home page |

**Postconditions:** 
- Player P2 has viewed game G1 details
- Player P2 is logged out

---

### Test Case 5: Player Modifies Profile and Leaves Game

**Objective:** Verify that a player can modify their profile, view games, join a game, and leave a game.

**Preconditions:** 
- Application is running
- Player P1 account exists (from Test Case 2)
- Game G1 exists (from Test Case 1)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Navigate to the application home page | Home page displays |
| 5.2 | Log in with P1 credentials (email: "player1@test.com", password: "password123") | Login successful, redirected to dashboard |
| 5.3 | Navigate to profile settings (if available) or verify profile info in header | Profile information displayed (name: "Player One") |
| 5.4 | Click "Browse Games" in navigation | Browse games page displays |
| 5.5 | Locate game G1 (Soccer at Recreation Center) | Game G1 is visible with all details |
| 5.6 | Click "View Details" on game G1 | Modal opens showing game details |
| 5.7 | Close modal and click "Join" button on game G1 | Success notification: "Successfully joined the match!" |
| 5.8 | Navigate to "My Games" | My Games page displays |
| 5.9 | Click "Games I Joined" tab | G1 appears in the joined games list |
| 5.10 | Click "Leave Match" button on game G1 | Confirmation modal appears |
| 5.11 | Confirm leaving the match | Success notification: "Left match successfully", G1 removed from joined games |
| 5.12 | Log out of the application | User logged out, redirected to home page |

**Postconditions:** 
- Player P1 has joined and then left game G1
- Player P1 is no longer a participant in game G1

---

### Test Case 6: Host Edits Game, Views Statistics, and Modifies Profile

**Objective:** Verify that a host can view their created games, edit game details, view player statistics, and modify their profile.

**Preconditions:** 
- Application is running
- Host H1 account exists (from Test Case 1)
- Game G1 exists with at least one player (P2 from Test Case 3)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6.1 | Navigate to the application home page | Home page displays |
| 6.2 | Log in with H1 credentials (email: "host1@test.com", password: "password123") | Login successful, redirected to dashboard |
| 6.3 | Click "My Games" in navigation | My Games page displays |
| 6.4 | Verify "Games I Created" tab is active | List of created games displays including G1 and G2 |
| 6.5 | View player statistics on game G1 | Player count displayed (e.g., "1 / 10" showing players joined vs limit) |
| 6.6 | Click "Edit" button on game G1 | Edit game form opens with current values pre-filled |
| 6.7 | Change Player Limit from "10" to "12" | Form accepts the new value |
| 6.8 | Click "Update Game" button | Success notification shown, player limit updated |
| 6.9 | Verify game G1 shows updated player limit | G1 displays "X / 12" for player count |
| 6.10 | Navigate to profile settings (if available) | Profile page displays |
| 6.11 | Verify profile information can be viewed | Current profile information displayed |
| 6.12 | Log out of the application | User logged out, redirected to home page |

**Postconditions:** 
- Game G1 player limit has been updated to 12
- Host H1 is logged out

---

## Test Data Summary

| Entity | Identifier | Key Attributes |
|--------|------------|----------------|
| Host H1 | host1@test.com | Name: "Host One", Username: "host1" |
| Player P1 | player1@test.com | Name: "Player One", Username: "player1" |
| Player P2 | player2@test.com | Name: "Player Two", Username: "player2" |
| Game G1 | Created by H1 | Sport: Soccer, Location: Recreation Center, Date: 2025-12-15, Time: 10:00 AM, Player Limit: 10→12 |
| Game G2 | Created by H1 | Sport: Basketball, Location: Gym, Date: 2025-12-16, Time: 2:00 PM, Player Limit: 8 |

---

## Test Execution Checklist

| Test Case | Description | Pass/Fail | Date | Tester | Notes |
|-----------|-------------|-----------|------|--------|-------|
| TC1 | Host Creates Profile and Games | | | | |
| TC2 | Player Creates Profile | | | | |
| TC3 | Player Views and Joins Games | | | | |
| TC4 | Player Views Game Details | | | | |
| TC5 | Player Modifies Profile and Leaves Game | | | | |
| TC6 | Host Edits Game, Views Statistics, Modifies Profile | | | | |

---

## Environment Requirements

- **Backend:** Spring Boot application running on localhost:8080
- **Frontend:** React/Vite application running on localhost:5173
- **Database:** PostgreSQL with clean test data
- **Browser:** Chrome, Firefox, or Safari (latest version)
