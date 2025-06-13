# 📡 Satellites Web Application – Documentation

## 📝 Description
This project is a full-stack web application for **satellite data communication**, allowing visualization, versioning, and download of satellite-generated files. It integrates a **React frontend**, a **Django REST API**, and a **PostgreSQL database**.

---

## 🧩 Architecture Overview

* **Frontend**: React.js (SPA & multipage variants)
* **Backend**: Django REST Framework
* **Database**: PostgreSQL (UMS-EOSAT schema)
* **Communication**: HTTP/JSON (Axios)

```text
User ⇄ React Frontend ⇄ Django API ⇄ PostgreSQL DB
```

---

## 🎯 Project Objectives

* Manage satellite file metadata and versions
* Communicate with a PostgreSQL database with multiple schemas
* Allow downloading and consulting satellite subsystem files
* Display file metadata and support multiple formats (CSV, JSON, binary)

---

## 🗃️ Database Design (PostgreSQL)

Follows the **UMS-EOSAT schema**, including:

### 🧱 Tables:

* `sat_files`: Tracks files by subsystem
* `db_files`: File version metadata (hash, signature, type, size, etc.)
* `download_entries_archive`: Archives of downloaded file chunks
* `download_gaps`: Tracks missing file chunks (gaps)

### 🔄 Challenges:

* Managing multiple schemas (`UM5-EOSAT`, `MOHAMMEDIA-SAT`)
* Raw SQL queries for dynamic schema access

---

## ⚙️ Backend (Django)

### 🔨 Setup:

* Python, Django, psycopg2
* Models generated with `inspectdb`
* REST API with Django REST Framework

### 🔧 Key Files:

* `models.py`: Reflects PostgreSQL structure
* `views.py`: Custom views with raw SQL for dynamic schema access
* `serializers.py`: Translates models ⇄ JSON
* `urls.py`: Routes for API endpoints

### 📡 Notable API Endpoints:

```
GET /api/satellites
GET /api/satellites/<sat_id>/subsystems
GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/
GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/<file_id>/download/
GET /api/satellites/<sat_id>/fig/
GET /api/satellites/<sat_id>/logs/
```

---

## 💻 Frontend (React)

### 🧱 Structure:

* `src/api/`: Axios API client (`apiService.js`)
* `src/pages/`: UI Pages (Dashboard, Files, Subsystems, FileViewer)
* `SatelliteDashboard`: Main component managing state and display

### 🎨 UI Features:

* Tailwind CSS
* Dynamic tables, dropdowns, download buttons
* Progress bars, error handling

### 🔗 Communication:

Axios calls to Django backend using `apiService.js`.

---

## 🧠 One-Page Version

Also includes a **SPA dashboard** version:

* File: `SatelliteDashboard.js`
* Uses React hooks (`useState`, `useEffect`)
* Features:

  * Satellite selection
  * Subsystem file listing
  * Version & metadata viewing
  * Downloading files

---

## 🚧 Development Challenges

* PostgreSQL multi-schema access
* Parsing of multi-format files (CSV, JSON, PNG, JPG)
* Column name inconsistencies in legacy schema
* Manual use of raw SQL and view materialization

---

## 🛠️ Setup Instructions

### 🔁 Backend (Django)

```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
psql -U postgres -d postgres -f createdatabase.sql
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### ⚛️ Frontend (React)

```bash
cd frontend/
npm install
npm start
```

---

## 🧪 Sample API Usage

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getSatellites = () => api.get('satellites/');
export const getSubsystems = (satId) => api.get(`satellites/${satId}/subsystems/`);
export const getFiles = (satId, subId) => api.get(`satellites/${satId}/subsystems/${subId}/files/`);
```

---

## 🧪 Demo App !

![Satellites](https://github.com/assets/sats.jpg)

![Subsystems](https://github.com/assets/subs.jpg)

![File versions](https://github.com/assets/fileVersions.jpg)

## 👨‍💻 Author

* Ismail AIT MOUMAD
Email: ismailaitmoumad1@gmail.com