import Navbar from '@/components/Navbar';
import UpdatePasswordWrapper from '@/components/User/UpdatePassword'; // Adjust the import path accordingly
import Footer from '@/components/footer';

const Page = () => {
    return (
        <div>
            <Navbar />
            <UpdatePasswordWrapper />
            <Footer />
        </div>
    );
};

export default Page;
