import { useState } from 'react';
import { Pagination, Mousewheel, Keyboard, Navigation, FreeMode, Thumbs } from 'swiper/modules';
import { FaCircleChevronLeft, FaCircleChevronRight, FaXmark } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

const WSPGallery = ({ galleryImages }) => {
    const [slideNumber, setSlideNumber] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const handleOpenModal = (index) => {
        setSlideNumber(index);
        setOpenModal(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Previous Image
    const prevSlide = () => {
        slideNumber === 0
            ? setSlideNumber(galleryImages.length - 1)
            : setSlideNumber(slideNumber - 1);
    };

    // Next Image  
    const nextSlide = () => {
        slideNumber + 1 === galleryImages.length
            ? setSlideNumber(0)
            : setSlideNumber(slideNumber + 1);
    };

    return (
        <div className="w-full">
            {openModal && (
                <div className="sliderWrap fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
                    <FaXmark className="btnClose text-white text-2xl absolute top-5 right-5 cursor-pointer" onClick={handleCloseModal} />
                    <FaCircleChevronLeft className="btnPrev text-white text-3xl absolute left-5 cursor-pointer" onClick={prevSlide} />
                    <FaCircleChevronRight className="btnNext text-white text-3xl absolute right-5 cursor-pointer" onClick={nextSlide} />
                    <div className="fullScreenImage flex justify-center items-center max-w-screen-lg mx-auto">
                        <img src={galleryImages[slideNumber].fileurl} alt={`car-${slideNumber}`} className="w-full max-h-screen object-contain" />
                    </div>
                </div>
            )}

            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl flex flex-col justify-center items-center px-4">
                <Swiper
                    loop={true}
                    navigation={true}
                    mousewheel={true}
                    keyboard={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Pagination, Mousewheel, Keyboard, Navigation, FreeMode, Thumbs]}
                    className="mySwiper w-full"
                >

                    {galleryImages?.map((image, index) => (
                        <SwiperSlide key={index} className="w-full">
                            <div className="flex justify-center items-center cursor-pointer"
                                onClick={() => handleOpenModal(index)}>
                                <img
                                    src={image.fileurl}
                                    alt={`car-${index}`}
                                    className="object-cover rounded-md h-72 w-full sm:h-96 md:h-[28rem]"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={8}
                    slidesPerView={6}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    navigation={true}
                    mousewheel={true}
                    className="mySwiper mt-2 w-full"
                    breakpoints={{
                        640: { slidesPerView: 4 },
                        768: { slidesPerView: 6 },
                        1024: { slidesPerView: 8 }
                    }}
                >


                    {galleryImages?.map((image, index) => (
                        <SwiperSlide key={index} className="flex justify-center items-center">
                            <div className="cursor-pointer">
                                <img
                                    src={image.fileurl}
                                    alt={`thumb-car-${index}`}
                                    className="object-cover rounded-md h-16 w-16 sm:h-20 sm:w-20"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default WSPGallery;

