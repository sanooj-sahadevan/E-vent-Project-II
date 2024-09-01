import Image from 'next/image';
import vendorType1 from '../public/2.jpg.jpg'; // Replace with actual paths
import vendorType2 from '../public/2.jpg.jpg'; // Replace with actual paths
import vendorType3 from '../public/2.jpg.jpg'; // Replace with actual paths
import brandVendor1 from '../public/2.jpg.jpg'; // Replace with actual paths
import brandVendor2 from '../public/2.jpg.jpg'; // Replace with actual paths
import brandVendor3 from '../public/2.jpg.jpg'; // Replace with actual paths
import communityImage from '../public/2.jpg.jpg'; // Replace with actual path

const Home = () => {
    return (
        <div className="container mx-auto">


            {/* Vendor Types */}
            <div className="py-10">
  <h2 className="text-center text-2xl font-bold">Vendor Types</h2>
  <div className="flex justify-center space-x-10 mt-10 w-full max-w-4xl mx-auto"> {/* Ensure container is full width */}
    <div className="text-center flex-1 max-w-[200px]"> {/* Adjust size and ensure responsiveness */}
      <div className="relative w-full h-full aspect-square mx-auto"> {/* Full width and maintain aspect ratio */}
        <Image
          src={vendorType1}
          alt="Vendor 1"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <p className="mt-2 text-xl">Bride</p> {/* Increased text size */}
    </div>
    <div className="text-center flex-1 max-w-[200px]"> {/* Adjust size and ensure responsiveness */}
      <div className="relative w-full h-full aspect-square mx-auto"> {/* Full width and maintain aspect ratio */}
        <Image
          src={vendorType1}
          alt="Vendor 1"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <p className="mt-2 text-xl">Bride</p> {/* Increased text size */}
    </div>
    <div className="text-center flex-1 max-w-[200px]"> {/* Adjust size and ensure responsiveness */}
      <div className="relative w-full h-full aspect-square mx-auto"> {/* Full width and maintain aspect ratio */}
        <Image
          src={vendorType2}
          alt="Vendor 2"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <p className="mt-2 text-xl">Photography</p> {/* Increased text size */}
    </div>
    <div className="text-center flex-1 max-w-[200px]"> {/* Adjust size and ensure responsiveness */}
      <div className="relative w-full h-full aspect-square mx-auto"> {/* Full width and maintain aspect ratio */}
        <Image
          src={vendorType3}
          alt="Vendor 3"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <p className="mt-2 text-xl">Makeup</p> {/* Increased text size */}
    </div>
  </div>
</div>



            {/* Top Brand Vendors */}
            <div className="py-10 bg-gray-100">
                <h2 className="text-center text-2xl font-bold">Top Brand Vendors</h2>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                        <Image
                            src={brandVendor1}
                            alt="Brand 1"
                            layout="responsive"
                            width={300}
                            height={200}
                            className="object-cover"
                        />
                        <p className="mt-2">Harmony</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src={brandVendor2}
                            alt="Brand 2"
                            layout="responsive"
                            width={300}
                            height={200}
                            className="object-cover"
                        />
                        <p className="mt-2">Luxury</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src={brandVendor3}
                            alt="Brand 3"
                            layout="responsive"
                            width={300}
                            height={200}
                            className="object-cover"
                        />
                        <p className="mt-2">Elegance</p>
                    </div>
                </div>
            </div>

            {/* Join Our Community */}
            <div className="py-10">
                <div className="relative w-full h-[40vh]"> {/* Adjust height as needed */}
                    <Image
                        src={communityImage}
                        alt="Join Our Community"
                        layout="fill" // Use "fill" to cover the container
                        objectFit="cover" // Ensure the image covers the container
                        className="w-full h-full"
                    />
                </div>
                <div className="text-center mt-6">
                    <h2 className="text-2xl font-bold">Join our Community</h2>
                </div>
            </div>



        </div>
    );
};

export default Home;
