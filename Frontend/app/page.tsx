import Navbar from "@/components/Navbar";
import Image from "next/image";
import Signup from '@/components/Signup'
import Login from '@/components/Login'


export default function Home() {
  return (
    <div>
      <Navbar />
      {/* <Signup/> */}
      {/* <Login/> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <h1 className="text-6xl font-bold text-gray-800">Dashboard</h1>
</div>

    </div>
  );
}
