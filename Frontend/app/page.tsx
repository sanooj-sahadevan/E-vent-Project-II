import Navbar from "@/components/Navbar";
import Image from "next/image";
import Signup from '@/components/Signup'
// import Login from '@/components/Login'
// import Login from '@/components/login'
import UserMain from '@/components/userMain'
import Dashboard from '@/components/userdashboard'
import Footer from '@/components/footer'
export default function Home() {
  return (
    <div>
      <Navbar />
      <UserMain />
      <Dashboard />
      <Footer />


    </div>
  );
}
