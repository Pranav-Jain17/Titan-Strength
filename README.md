## 📖 Project Description
TitanStrength is a comprehensive, full-stack gym management platform designed to streamline facility operations and enhance the member experience. Built to reliably handle 100+ active members, the platform features a modern React.js frontend integrated with a robust Role-Based Access Control (RBAC) system. The UI is meticulously designed to match professional owner and manager dashboards, providing an intuitive experience across all user roles. The codebase is maintained with strict quality standards, ensuring a clean, comment-free structure for optimal readability and seamless team collaboration.

## ✨ Key Features
* **Role-Based Access Control (RBAC):** Secure, distinct portals tailored for gym Owners, Managers, Trainers, and Members.
* **Real-Time Dashboards:** Interactive and responsive metrics providing live insights into gym operations and member activity.
* **Automated Subscription Billing:** Frictionless membership management with automated billing cycles to reduce administrative overhead.
* **Trainer Scheduling & Management:** Integrated tools for coordinating personal training sessions, classes, and trainer availability.
* **Secure Authentication Flow:** Robust login systems including unified `forgotPassword` logic with user-friendly password visibility toggles.
* **Dynamic API Integration:** Highly adaptable backend communication utilizing dynamic string templates for scalable API endpoint configuration.

## 🚀 How to Run

### Prerequisites
* Node.js (v16.x or higher recommended)
* npm or yarn package manager

### Installation & Setup
1. **Clone the repository**
```bash
   git clone [https://github.com/your-username/TitanStrength.git](https://github.com/your-username/TitanStrength.git)
   ```
2. **Navigate to the project directory**
   ```bash
   cd TitanStrength
   ```
3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
4. **Configure Environment Variables**
   Create a `.env` file in the root directory. Ensure your backend API URLs are set up to be consumed by the dynamic string templates in the services layer:
   ```env
   REACT_APP_API_BASE_URL=backend_api_url
   ```
5. **Start the Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

