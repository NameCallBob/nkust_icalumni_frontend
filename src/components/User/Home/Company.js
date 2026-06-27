import Axios from "common/Axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, User, Package } from "lucide-react";
import { Section, Card, Button, EmptyState } from "components/common/ui";
import { handleImageError, getImageSrc } from "../../../utils/imageDefaults";

function Company() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    Axios()
      .get("company/data/randomCompanies/")
      .then((res) => {
        setCompanies(res.data);
      });
  }, []);
  // 將公司陣列分割成每組4個
  const groupedCompanies = [];
  for (let i = 0; i < companies.length; i += 4) {
    groupedCompanies.push(companies.slice(i, i + 4));
  }

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };
  const handleNavi = () => {
    navigate("/search");
  };

  return (
    <Section
      eyebrow="ALUMNI ENTERPRISES"
      title="系友公司"
      subtitle="智慧商務系系友們在各行各業耕耘有成，一起認識這些值得信賴的系友企業。"
      width="wide"
    >
      {companies.length === 0 ? (
        <EmptyState
          title="目前尚無系友企業資料"
          description="敬請期待更多系友企業加入展示。"
        />
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          loop={groupedCompanies.length > 1}
          className="w-full !pb-2"
        >
          {groupedCompanies.map((group, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 px-1 pb-2">
                {group.map((company, idx) => (
                  <Card
                    key={idx}
                    hover
                    padding="none"
                    className="group cursor-pointer overflow-hidden flex flex-col"
                    onClick={() => handleItemClick(company.member)}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-200">
                      <img
                        loading="lazy"
                        src={getImageSrc(
                          company.photo
                            ? process.env.REACT_APP_BASE_URL + company.photo
                            : null,
                          "company",
                        )}
                        alt={company.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => handleImageError(e, "company")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/45 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-start gap-2">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 size={16} />
                        </span>
                        <h3 className="font-serif text-lg font-bold leading-snug text-base-content break-words transition-colors group-hover:text-primary">
                          {company.name}
                        </h3>
                      </div>

                      <dl className="space-y-2 text-sm text-base-content/70">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={15} className="shrink-0 text-secondary" />
                          <dt className="sr-only">系級</dt>
                          <dd className="truncate">
                            <span className="font-medium text-base-content/55">系級</span>
                            <span className="mx-1.5 text-base-content/25">/</span>
                            {company.graduate_grade}級
                          </dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={15} className="shrink-0 text-secondary" />
                          <dt className="sr-only">系友</dt>
                          <dd className="truncate">
                            <span className="font-medium text-base-content/55">系友</span>
                            <span className="mx-1.5 text-base-content/25">/</span>
                            {company.member_name}
                          </dd>
                        </div>
                        <div className="flex items-start gap-2">
                          <Package size={15} className="mt-0.5 shrink-0 text-secondary" />
                          <dt className="sr-only">產品</dt>
                          <dd className="break-words">
                            <span className="font-medium text-base-content/55">產品</span>
                            <span className="mx-1.5 text-base-content/25">/</span>
                            {company.products}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </Card>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="mt-10 flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleNavi}
          aria-label="探索更多系友企業資訊"
          className="rounded-xl gap-2"
        >
          探索系友企業
          <ArrowRight size={18} />
        </Button>
      </div>
    </Section>
  );
}

export default Company;
