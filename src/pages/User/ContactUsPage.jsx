import React from "react";
import { Button, Field, Section, Card } from "components/common/ui";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaLine, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import SEO from 'SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ContactUsPage = () => {

    const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = {
        name: event.target.formName.value,
        email: event.target.formEmail.value,
        phone: event.target.formPhone.value,
        message: event.target.formMessage.value,
      };

      try {
        const response = await Axios().post("record/contact/" , formData)

        if (response) {
          toast.success("提交成功，講有專員為您服務～")
        } else {
          toast.warn("提交失敗，請注意資訊是否填寫正確")
        }
      } catch (error) {
        toast.error("伺服器忙碌中，請稍後再試！")
      }
    };

  return (
    <div className="bg-base-200/40 min-h-screen">
      <SEO
        main={false}
        title="聯絡我們"
        description="若有任何疑問或建議，歡迎聯絡智慧商務系友會，我們將竭誠為您服務。"
        keywords={["智慧商務", "聯絡我們", "客服"]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(160,120,28,0.4) 0, transparent 45%), radial-gradient(circle at 85% 70%, rgba(255,255,255,0.15) 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-secondary uppercase">
              Contact Us
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              聯絡我們
            </h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-white/70" />
            <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
              若有任何疑問或建議，歡迎聯絡智慧商務系友會，我們將竭誠為您服務。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 聯絡資訊 + 地圖 */}
      <Section width="wide" className="!pb-6">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 聯絡資訊 */}
            <Card padding="lg" className="lg:col-span-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-base-content">
                聯絡資訊
              </h2>
              <div className="mt-2 mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-secondary to-primary" />

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaPhoneAlt className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">電話</p>
                    <p className="mt-0.5 text-base-content break-words">07-3814526 轉 17501</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaEnvelope className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">信箱</p>
                    <p className="mt-0.5 break-words">
                      <a
                        href="mailto:icdaa2019@nkust.edu.tw"
                        className="text-primary hover:text-secondary transition-colors hover:underline"
                      >
                        icdaa2019@nkust.edu.tw
                      </a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaMapMarkerAlt className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">地址</p>
                    <p className="mt-0.5 text-base-content break-words">807高雄市三民區建工路415號</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaClock className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">營業時間</p>
                    <p className="mt-0.5 text-base-content leading-relaxed">
                      週一～五 上午 09:00 - 17:00 <br /> 休息時間為12:00～13:30
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 border-t border-base-300/70 pt-6">
                <p className="mb-3 text-xs font-semibold tracking-wide text-base-content/50 uppercase">追蹤我們</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/ic.nkust/?locale=zh_TW"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-200 text-[#1877f2] transition-all hover:-translate-y-0.5 hover:shadow-md"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href="https://line.me/R/ti/p/@261cygls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-200 text-[#06c755] transition-all hover:-translate-y-0.5 hover:shadow-md"
                    aria-label="LINE"
                  >
                    <FaLine className="text-xl" />
                  </a>
                  <a
                    href="https://www.instagram.com/ic.nkust/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-200 text-[#e1306c] transition-all hover:-translate-y-0.5 hover:shadow-md"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Google Map */}
            <Card padding="none" className="lg:col-span-3 overflow-hidden">
              <div className="h-72 sm:h-96 lg:h-full w-full">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.0610532783326!2d120.32608597615351!3d22.651512179435628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04d91d096a91%3A0x75ce7e7f7c793c56!2z5ZyL56uL6auY6ZuE56eR5oqA5aSn5a24IOW7uuW3peagoeWNgA!5e0!3m2!1szh-TW!2stw!4v1731937467206!5m2!1szh-TW!2stw"
                  style={{ border: 0, width: "100%", height: "100%" }}
                  className="min-h-[18rem]"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>
          </div>
        </motion.div>
      </Section>

      {/* 聯絡我們表單 */}
      <Section width="narrow" className="!pt-4">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card padding="lg">
            <div className="text-center mb-8">
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
                Send a message
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-base-content">
                聯絡我們
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
              <p className="mt-4 text-sm sm:text-base text-base-content/60">
                如果您有任何問題或建議，請填寫以下表單，我們將盡快與您聯繫！
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field
                  as="input"
                  id="formName"
                  type="text"
                  label="姓名"
                  placeholder="請輸入您的姓名"
                  required
                />

                <Field
                  as="input"
                  id="formEmail"
                  type="email"
                  label="電子郵件"
                  placeholder="請輸入您的電子郵件"
                  required
                />
              </div>

              <Field
                as="input"
                id="formPhone"
                type="text"
                label="聯絡電話"
                placeholder="請輸入您的聯絡電話"
              />

              <Field
                as="textarea"
                id="formMessage"
                rows={5}
                label="訊息內容"
                placeholder="請輸入您的訊息內容"
                required
              />

              <div className="mt-2 text-center">
                <Button variant="primary" type="submit" className="px-10">
                  送出
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </Section>
    </div>
  );
};

export default ContactUsPage;
