import AdminDashboard from "./admin-dashboard"
import { config } from '@/constants/index'

const apiUrl = config.apiUrl;

export default async function AdminPage() {

  return <AdminDashboard />
}