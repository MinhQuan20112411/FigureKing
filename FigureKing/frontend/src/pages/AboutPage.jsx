import React from 'react';
import FounderCard from '../components/FounderCard'; // Import component FounderCard
import './AboutPage.css'; // Đảm bảo rằng bạn có file CSS để định dạng trang

const About = () => {
    const founders = [
        {
            name: 'Đoàn Đại Nghĩa',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png')
        },
        
        {
            name: 'Lê Trần Quốc Bảo',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png')
        },
        {
            name: 'Trần Minh Quân',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png')
        }
    ];

    return (
        <div className="about-page-container">
            <h2 className="about-page-title">Về Chúng Tôi</h2> {/* Tiêu đề trang */}

            {/* Giới thiệu doanh nghiệp */}
            <section className="company-introduction-section">
                <h3 className="company-introduction-title">Giới Thiệu Doanh Nghiệp</h3>
                <p className="company-introduction-description">Chào mừng bạn đến với FigureKing thế giới dành riêng cho những người đam mê figure! Chúng tôi tự hào là một trong những cửa hàng trực tuyến uy tín chuyên cung cấp các mô hình figure chính hãng từ các thương hiệu nổi tiếng.</p>
                <p className="company-introduction-description">Với mong muốn mang đến cho khách hàng những sản phẩm chất lượng nhất, FigureKing không ngừng cập nhật những mẫu figure mới nhất từ anime, manga, game và các bộ phim nổi tiếng. Dù bạn là người sưu tầm figure chuyên nghiệp hay đơn giản chỉ muốn tìm một món quà ý nghĩa, chúng tôi luôn sẵn sàng phục vụ bạn.</p>
            </section>

            {/* Mục tiêu và phương châm */}
            <section className="company-goals-section">
                <h3 className="company-goals-title">Mục Tiêu và Phương Châm</h3>
                <p className="company-goals-description">Phương châm của chúng tôi là mang đến các sản phẩm figure cao cấp đến với mọi đối tượng khách hàng, từ những đối tượng ít quan tâm đến figure đến các tín đồ đam mê figure. Chúng tôi luôn cam kết mang đến những sản phẩm chất lượng, đẹp mắt và phù hợp với nhu cầu của từng khách hàng.</p>
            </section>

            {/* Danh sách các nhà sáng lập */}
            <div className="founders-list-container">
                {founders.map((founder, index) => (
                    <FounderCard 
                        key={index} 
                        name={founder.name} 
                        position={founder.position} 
                        image={founder.image} 
                    />
                ))}
            </div>
        </div>
    );
};

export default About;
