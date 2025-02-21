# **FlowTask** - Task Management Application

**Description**  
FlowTask is a task management application that allows users to organize tasks by categories such as **"To-Do"**, **"In Progress"**, and **"Done"**. It includes a drag-and-drop interface for task management and user authentication to store and retrieve tasks.

## Live Link  
- [FlowTask](https://flowtask-arijit.web.app/)

## Dependencies

    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@tailwindcss/vite": "^4.0.7",
    "firebase": "^11.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "7.2",
    "react-router-dom": "7.2",
    "sweetalert2": "^11.17.2",
    "tailwindcss": "^4.0.7"

## Technologies used
- **React js**
- **Tailwind CSS**
- **Express js**
- **MongoDb**
- **Firebase**

## Setup Process
**clone the repository**
```bash
git clone https://github.com/ImArijitBasu/FLowtask.git
cd Flowtask
```
**Backend setup**
```bash
cd server
npm install
```
configure environment variable `DB_USER` & `DB_PASS` in a `.env` file
```bash
npm start 
```
**Frontend setup**
```bash
cd client
npm install
```
Configure firebase credentials in `.env.local` file

```bash
npm run dev
```
**--------------------------------Now you are all set--------------------------------**
