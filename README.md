# me_website_rebuilt

**me_website_rebuilt** is a website project designed for individuals to send envelopes from Mektup Evi. Built with FastAPI for the backend, Vite React for the admin panel, and React for the frontend.

## Features

- **Responsive Design**: Optimized for various devices, ensuring accessibility on desktops, tablets, and smartphones.
- **Interactive Elements**: Engage visitors with interactive components such as sliders, modals, and animations.
- **Contact Form**: Allow visitors to reach out through an integrated contact form.
- **Blog Section**: Share insights, articles, and updates through a built-in blogging platform.

## Technologies Used

- **Backend**: FastAPI
- **Frontend**: React
- **Admin Panel**: Vite React
- **Database**: SQLite

## Installation

To set up the me_website_rebuilt project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/burakpekisik/me_website_rebuilt.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd me_website_rebuilt
   ```

3. **Set Up the Backend**:

   - **Create a Virtual Environment**:

     ```bash
     python3 -m venv venv
     ```

   - **Activate the Virtual Environment**:

     - On Windows:

       ```bash
       .\venv\Scripts\activate
       ```

     - On macOS/Linux:

       ```bash
       source venv/bin/activate
       ```

   - **Install Dependencies**:

     ```bash
     pip install -r backend/requirements.txt
     ```

   - **Configure Environment Variables**:

     Create a `.env` file in the `backend` directory with the following content:

     ```
     DATABASE_URL=sqlite:///./database.db
     SECRET_KEY=your_secret_key
     ```

     Replace `your_secret_key` with a secure key of your choice.

   - **Run the Backend Server**:

     ```bash
     uvicorn backend.main:app --reload
     ```

     The backend server will be accessible at `http://localhost:8000`.

4. **Set Up the Frontend**:

   - **Navigate to the Frontend Directory**:

     ```bash
     cd frontend
     ```

   - **Install Dependencies**:

     ```bash
     npm install
     ```

   - **Run the Frontend Development Server**:

     ```bash
     npm run dev
     ```

     The frontend will be accessible at `http://localhost:3000`.

5. **Set Up the Admin Panel**:

   - **Navigate to the Admin Panel Directory**:

     ```bash
     cd admin_panel
     ```

   - **Install Dependencies**:

     ```bash
     npm install
     ```

   - **Run the Admin Panel Development Server**:

     ```bash
     npm run dev
     ```

     The admin panel will be accessible at `http://localhost:4000`.

## Usage

1. **Access the Website**: Open your web browser and navigate to `http://localhost:3000` to view the personal website.
2. **Access the Admin Panel**: Navigate to `http://localhost:4000` to manage content and settings.
3. **Access the Backend**: The backend API is accessible at `http://localhost:8000`.

## Acknowledgments

- [FastAPI](https://github.com/tiangolo/fastapi): A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
- [Vite](https://github.com/vitejs/vite): A next-generation, fast build tool for modern web projects.
- [React](https://github.com/facebook/react): A JavaScript library for building user interfaces.
- [SQLite](https://github.com/sqlite/sqlite): A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.

## Disclaimer

This project is intended for personal use and educational purposes. The maintainers are not responsible for any misuse or unintended consequences arising from the use of this software. 
