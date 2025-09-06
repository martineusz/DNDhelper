# 🐉 D&D Encounter Tracker

A web application to manage and track **Dungeons & Dragons encounters**.  
With this tool, you can:

- Save and organize encounters
- Track initiative during combat
- Browse existing monster stat blocks

Built with a **Django + PostgreSQL backend** and a **React frontend**, all containerized with **Docker** for easy deployment.

---

## 📂 Project Structure

```
.
├── backend/              # Django backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   └── ...
├── frontend/             # React frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.prod.yml
├── db.env                # Local/Postgres environment variables
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dnd-encounter-tracker.git
cd dnd-encounter-tracker
```

### 2. Configure Environment Variables
- **Backend:** `backend/.env.prod`
- **Database:** `/db.env`

Defaults are already provided:
```env
POSTGRES_DB=myproject
POSTGRES_USER=myuser
POSTGRES_PASSWORD=supersecretpassword
```

### 3. Build and Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

This will start three services:
- **db** → PostgreSQL 15
- **backend** → Django + Gunicorn
- **frontend** → React app served by Nginx

### 4. Access the App
- Frontend → http://localhost:3000  
- Backend API → http://localhost:8000  
- PostgreSQL → localhost:5432  

---

## 🛠 Development Notes

- **Frontend**  
  - React + Nginx  
  - Build process handled in multi-stage Dockerfile  

- **Backend**  
  - Django (Gunicorn as WSGI server)  
  - Collects static files automatically on build  
  - Configured with `ALLOWED_HOSTS=*` for Docker  

- **Database**  
  - PostgreSQL with persistent Docker volume `postgres_data_prod`  

---

## ⚙️ Useful Commands

Rebuild containers after changes:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

Stop containers:
```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 📌 Roadmap

- [ ] User authentication (login/logout)
- [ ] Custom monster creation
- [ ] Export encounters as JSON
- [ ] Initiative auto-roller

---

## 🤝 Contributing

Contributions are welcome!  
Please open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.
