// import multer from 'multer';

// const storage = multer.memoryStorage(); // Store files in memory

// const upload = multer({ storage: storage });

// export default upload;


import multer from 'multer';
console.log('1 multeer');


const storage = multer.memoryStorage();
console.log('loooo');

const upload = multer({ storage });

export default upload;
