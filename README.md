# Hospital Admin Dashboard

A modern, responsive, and feature-rich Admin Dashboard for Hospital Management

## Features

- **Comprehensive Dashboard:** Real-time summary of hospital statistics, patient overview, and upcoming calendar events.
- **User & Access Management:** Manage staff, doctors, patients, and administrators with role-based access control.
- **Patient & Medical Records:** Track patient histories, medical records, laboratory tests, and prescriptions.
- **Operations:** Manage wards, beds, admissions, and appointments seamlessly.
- **Billing & Payments:** Integrated billing module to handle invoices and payments.
- **Modern UI:** Built using Tailwind CSS v4 and Base UI, featuring a clean, responsive, and accessible design system.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Base UI & custom accessible UI components
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

Ensure you have Node.js installed. You will also need the backend API running for the dashboard to fetch real data.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anoop017/Admin-FE-Hospital-V2.git
   ```

2. Navigate into the project directory:
   ```bash
   cd admin-hospital-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   Create a `.env.local` file in the root directory and specify the backend API URL.
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3042/api/v1
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app`: Contains the Next.js App Router pages and nested layouts.
- `src/components`: Reusable UI components, including specific feature modules (tables, dialogs) and base UI elements.
- `src/lib`: Utility functions, API configurations (`api.ts`), and authentication helpers.
- `src/types`: Global TypeScript definitions for data models and DTOs.
