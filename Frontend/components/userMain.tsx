import Image from 'next/image';
import headerImage from '../public/1.jpg.jpg'; // Replace with actual path

const Home = () => {
    return (
        <div className="container mx-auto">
            {/* Header Image */}
            <div className="relative w-full h-[80vh]   ">
                <Image
                    src={headerImage}
                    alt="Header Image"
                    layout="fill"
                    objectFit="cover"
                />

                {/* Search Bar */}
                <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow p-3 rounded-l-lg border-2 border-white text-black bg-white shadow-lg"
                        />
                        <button className="bg-buttonBg text-white p-3 rounded-r-lg shadow-lg">
                            Find Services
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
